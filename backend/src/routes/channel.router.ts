import { createChannel, getChannelPermission, getChannels } from '../controllers/channel.controller';
import { Router } from 'express';

const channelRouter: Router = Router();

channelRouter.get('/channels/:id', getChannels);
channelRouter.post('/channel',createChannel)
channelRouter.get('/channel/permission/:userId/:channelId', getChannelPermission)

export default channelRouter;
