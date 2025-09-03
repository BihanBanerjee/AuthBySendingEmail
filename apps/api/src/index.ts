import express from "express";
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { authRouter } from "./routes/auth";

const app = express()
dotenv.config()
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/user", authRouter);