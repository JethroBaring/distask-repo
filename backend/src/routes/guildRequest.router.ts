import { getRequestByGroup } from '../controllers/guildRequest.controller';
import { Router } from 'express';

const guildRequestRouter: Router = Router();

guildRequestRouter.get('/group/requests/:id', getRequestByGroup);

export default guildRequestRouter;
