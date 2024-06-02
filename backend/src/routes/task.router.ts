import { Router } from "express";
import { createTask, deleteTaskById, getTasksByGroupId, updateTaskById } from "../controllers/task.controller";

const taskRouter: Router = Router()

taskRouter.post('/task', createTask)
taskRouter.get('/tasks/:groupId', getTasksByGroupId)
taskRouter.patch('/task/:taskId', updateTaskById)
taskRouter.delete('/task/:taskId', deleteTaskById)

export default taskRouter