/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type Message = {
  id: number;
  content: string;
  user: { id: number; email: string };
};

export const Group = () => {
  const [user, setUser] = useState('');
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const user = getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const { id } = useParams();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  function sendMessage(e) {
    e.preventDefault();
    socket.emit('message', {
      userId: user.id,
      content: message,
      groupId: Number.parseInt(id!),
      token: user.accessToken,
      room: id,
    });
    setMessage('');
  }

  const scrollToBottom = () => {
    const bottomRef = document.getElementById('bottom') as HTMLDivElement;
    bottomRef?.scrollIntoView({ block: 'end' });
  };

  useEffect(() => {
    async function getMessages() {
      const response = await fetch(`http://localhost:3000/messages/${id}`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setMessages(data);
      }
    }

    if (user) {
      getMessages();
    }
  }, [id, user]);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom after messages are fetched and rendered
  }, [messages]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit('joinRoom', id);
    }

    function onDisconnect() {
      setIsConnected(false);
      socket.emit('leaveRoom', id);
    }

    function onMessageReceived(data) {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receivedMessage', onMessageReceived);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receivedMessage', onMessageReceived);
    };
  }, [id]);

  return (
    <>
      <div className='flex-1 overflow-scroll p-3'>
        <div className='h-0'>
          {messages.map((message: Message) => {
            if (message.user.id === user.id) {
              return (
                <div className='chat chat-end' key={message.id}>
                  <div className='chat-image avatar'>
                    <div class='avatar placeholder'>
                      <div class='bg-slate-400 text-neutral-content rounded-full w-11'>
                        <span class='text-xl'>AI</span>
                      </div>
                    </div>
                  </div>
                  <div className='chat-header font-bold'>You</div>
                  <div className='chat-bubble'>{message.content}</div>
                </div>
              );
            } else {
              return (
                <div className='chat chat-start' key={message.id}>
                  <div className='chat-image avatar'>
                    <div class='avatar placeholder'>
                      <div class='bg-slate-400 text-neutral-content rounded-full w-11'>
                        <span class='text-xl'>AI</span>
                      </div>
                    </div>
                  </div>
                  <div className='chat-header  font-bold'>
                    {message.user.email}
                  </div>
                  <div className='chat-bubble'>{message.content}</div>
                </div>
              );
            }
          })}

          <div id='bottom'></div>
        </div>
      </div>
      <form
        className='flex gap-3 items-center p-3 relative'
        onSubmit={sendMessage}
      >
        <input
          type='text'
          className='input w-full '
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button className='absolute right-[25px]' onClick={sendMessage}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
            />
          </svg>
        </button>
      </form>
    </>
  );
};
