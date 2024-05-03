import { getRequestByGuild } from '../controllers/guildRequest.controller';
import { Router } from 'express';

const guildRequestRouter: Router = Router();

guildRequestRouter.get('/guild/requests/:id', getRequestByGuild);

export default guildRequestRouter;
