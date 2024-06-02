import { Router } from "express";
import { createMessage, getMessagesByGuildId } from "../controllers/message.controller";

const messageRouter:Router = Router()

messageRouter.post('/message',createMessage)
messageRouter.get('/messages/:groupId/', getMessagesByGuildId)

export default messageRouter