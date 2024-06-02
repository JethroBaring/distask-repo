import { Router } from "express";
import { createTask, getTasksByGroupId, updateTaskById } from "../controllers/task.controller";

const taskRouter: Router = Router()

taskRouter.post('/task', createTask)
taskRouter.get('/tasks/:groupId', getTasksByGroupId)
taskRouter.patch('/task/:taskId', updateTaskById)

export default taskRouter