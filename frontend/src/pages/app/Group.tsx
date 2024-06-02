import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket';

type Message = {
  id: number;
  content: string;
  user: { id: number; email: string };
};

export const Group = () => {
  const { id } = useParams();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzE3Mjk4OTMxLCJleHAiOjE3MTc1NTgxMzF9.AjrzTJqXGypH04lcfKCSocFuuZlVZYysKsBje-H6DSk'

  function sendMessage(e) {
    e.preventDefault()
    socket.emit('message', {
      userId: 1,
      content: message,
      groupId: Number.parseInt(id!),
      token: token,
      room: id,
    });
    setMessage('');
  }
  
  useEffect(() => {
    async function getMessages() {
      const response = await fetch(`http://localhost:3000/messages/${id}`, {
        method: 'get',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzE3MzEzMDY4LCJleHAiOjE3MTc1NzIyNjh9.bYiQNXhP7RqzYODmmq-F8mczpR5GGp8Rf4eCKeJDIFo`
        }
      })

      const data = await response.json()

      if(response.ok) {
        console.log(data)
        setMessages(data)
      }
    }

    getMessages()
  }, [id])


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
      console.log('Message received:');
      console.log(data)
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
            if (message.user.id === 2) {
              return (
                <div className='chat chat-end' key={message.id}>
                  <div className='chat-image avatar'>
                    <div className='w-10 rounded-full'>
                      <img
                        alt='Tailwind CSS chat bubble component'
                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVA_HrQLjkHiJ2Ag5RGuwbFeDKRLfldnDasw&s'
                      />
                    </div>
                  </div>
                  <div className='chat-header text-red-700 font-bold'>
                    You
                    <time className='text-xs opacity-50'>12:46</time>
                  </div>
                  <div className='chat-bubble'>{message.content}</div>
                </div>
              );
            } else {
              return (
                <div className='chat chat-start' key={message.id}>
                  <div className='chat-image avatar'>
                    <div className='w-10 rounded-full'>
                      <img
                        alt='Tailwind CSS chat bubble component'
                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVA_HrQLjkHiJ2Ag5RGuwbFeDKRLfldnDasw&s'
                      />
                    </div>
                  </div>
                  <div className='chat-header text-sky-500 font-bold'>
                    {message.user.email}
                    <time className='text-xs opacity-50'>12:45</time>
                  </div>
                  <div className='chat-bubble'>{message.content}</div>
                </div>
              );
            }
          })}

          <div id='bottom'></div>
        </div>
      </div>
      <form className='flex gap-3 items-center p-3 relative' onSubmit={sendMessage}>
        <input
          type='text'
          className='input w-full'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button className='absolute right-[35px]' onClick={sendMessage}>
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
