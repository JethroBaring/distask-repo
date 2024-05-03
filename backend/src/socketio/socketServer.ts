import { createServer } from 'http';
import { Server } from 'socket.io';

const createSocketServer = (app) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173'],
    },
  });

  return { io, server };
};

export default createSocketServer;
