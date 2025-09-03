import express from "express";
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { authRouter } from "./routes/auth";

const app = express()
dotenv.config()
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/user", authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});