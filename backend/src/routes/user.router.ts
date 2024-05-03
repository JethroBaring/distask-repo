import { Router } from "express";
import { getUserById, getUsers } from "../controllers/user.controller";

const userRouter:Router = Router()

userRouter.get('/users', getUsers)
userRouter.get('/user/:id', getUserById)

export default userRouter