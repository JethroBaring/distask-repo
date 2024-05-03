import { Router } from "express";
import { login, refresh, signup } from "../controllers/auth.controller";

const authRouter: Router = Router()

authRouter.post('/login', login)
authRouter.post('/signup', signup)
authRouter.post('/refresh', refresh)

export default authRouter