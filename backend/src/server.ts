import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.router';
import authenticate from './middlewares/authenticate.middleware';
import userRouter from './routes/user.router';
import guildRouter from './routes/group.router';
import messageRouter from './routes/message.router';
import createSocketServer from './socketio/socketServer';
import socketEvents from './socketio/socketEvents';
import cookieParser from 'cookie-parser';
import taskRouter from './routes/task.router';

const app = express();
const { io, server } = createSocketServer(app);
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter);

app.use(authenticate);
app.use('/', userRouter);
app.use('/', guildRouter);
app.use('/', messageRouter);
app.use('/', taskRouter);

socketEvents(io);

server.listen(3000, () => {
  console.log(`listening on port 3000`);
});
