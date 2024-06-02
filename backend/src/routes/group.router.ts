import { Router } from 'express';
import {
  getGroupsByUser,
  getGroupById,
  createGroup,
  joinGroup,
  leaveGroup
} from '../controllers/group.controller';

const worldRouter: Router = Router();

worldRouter.get('/groups/:id', getGroupsByUser);
worldRouter.get('/group/:id', getGroupById);
worldRouter.post('/group/create', createGroup);
worldRouter.post('/group/join', joinGroup);
worldRouter.delete('/group/leave', leaveGroup)

export default worldRouter;
