import { Router } from "express";
import { createMessage, getMessagesByGuildChannel } from "../controllers/message.controller";

const messageRouter:Router = Router()

messageRouter.post('/message',createMessage)
messageRouter.get('/messages/:guildId/:channelId', getMessagesByGuildChannel)

export default messageRouter