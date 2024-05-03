import { Router } from 'express';
import {
  getGuildsByUser,
  getGuildById,
  createGuild,
  joinGuild,
  acceptGuildRequest,
  rejectGuildRequest,
} from '../controllers/group.controller';

const worldRouter: Router = Router();

worldRouter.get('/guilds/:id', getGuildsByUser);
worldRouter.get('/guild/:id', getGuildById);
worldRouter.post('/guild/create', createGuild);
worldRouter.post('/guild/join', joinGuild);
worldRouter.post('/guild/accept', acceptGuildRequest);
worldRouter.post('/guild/reject', rejectGuildRequest);

export default worldRouter;
