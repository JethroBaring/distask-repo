import { Router } from "express";
import { createTask, getTasksByGroupId } from "../controllers/task.controller";

const taskRouter: Router = Router()

taskRouter.post('/task', createTask)
taskRouter.get('/tasks/:id', getTasksByGroupId)

export default taskRouter