import { Router } from 'express';
import {
  getGroupsByUser,
  getGroupById,
  createGroup,
  joinGroup,
  acceptGroupRequest,
  rejectGroupRequest,
} from '../controllers/group.controller';

const worldRouter: Router = Router();

worldRouter.get('/groups/:id', getGroupsByUser);
worldRouter.get('/group/:id', getGroupById);
worldRouter.post('/group/create', createGroup);
worldRouter.post('/group/join', joinGroup);
worldRouter.post('/group/accept', acceptGroupRequest);
worldRouter.post('/group/reject', rejectGroupRequest);

export default worldRouter;
