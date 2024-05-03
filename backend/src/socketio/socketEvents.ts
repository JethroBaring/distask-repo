import { Server } from 'socket.io';

const socketEvents = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
      console.log('Room ', roomName);
    });

    socket.on('leaveRoom', (roomName) => {
      socket.leave(roomName);
      console.log('User left ', roomName);
    });

    socket.on('message', async (message) => {
      const response = await fetch('http://localhost:3000/message/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${message.token}`,
        },
        body: JSON.stringify({
          content: message.content,
          userId: message.userId,
          worldId: message.worldId,
          channelId: message.channelId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        io.to(message.room).emit('message', data);
      }
    });
  });
};

export default socketEvents;
