import { Router } from "express";
import { signUp, verifyEmail } from "../controllers/auth.controller";

export const authRouter: Router = Router();
authRouter.post("/signup", signUp);
authRouter.get("/verify-email", verifyEmail);