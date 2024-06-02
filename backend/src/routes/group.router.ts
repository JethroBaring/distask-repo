import { Router } from 'express';
import {
  getGroupsByUser,
  getGroupById,
  createGroup,
  joinGroup
} from '../controllers/group.controller';

const worldRouter: Router = Router();

worldRouter.get('/groups/:id', getGroupsByUser);
worldRouter.get('/group/:id', getGroupById);
worldRouter.post('/group/create', createGroup);
worldRouter.post('/group/join', joinGroup);

export default worldRouter;
