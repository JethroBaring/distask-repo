import { Server } from 'socket.io';

export const socketServer = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173']
    }
  })

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
  
    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
      console.log('Room ', roomName);
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
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        io.to(message.room).emit('message', data);
      }
    });
  });

  return server
}