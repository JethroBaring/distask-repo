import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.router';
import authenticate from './middlewares/authenticate.middleware';
import userRouter from './routes/user.router';
import guildRouter from './routes/guild.router';
import channelRouter from './routes/channel.router';
import messageRouter from './routes/message.router';
import guildRequestRouter from './routes/guildRequest.router';
import createSocketServer from './socketio/socketServer';
import socketEvents from './socketio/socketEvents';
import cookieParser from 'cookie-parser'

const app = express();
const { io, server } = createSocketServer(app)

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use('/', authRouter);

app.use(authenticate);
app.use('/', userRouter);
app.use('/', guildRouter);
app.use('/', messageRouter);
app.use('/', channelRouter)
app.use('/', guildRequestRouter)

socketEvents(io)

server.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
