import { Router } from 'express';
import {
  createGroup,
  getGroupById,
  getGroupsByUser,
  joinGroup,
  leaveGroup
} from '../controllers/group.controller';

const groupRouter: Router = Router();

groupRouter.get('/groups/:id', getGroupsByUser);
groupRouter.get('/group/:id', getGroupById);
groupRouter.post('/group/create', createGroup);
groupRouter.post('/group/join', joinGroup);
groupRouter.delete('/group/leave', leaveGroup)

export default groupRouter;
