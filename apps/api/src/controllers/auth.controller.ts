import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../../../generated/prisma";
import transporter from "../transpoter";

const prisma = new PrismaClient();

const generateVerificationToken = (email: string) => {
    return jwt.sign({email, type: 'verification'}, process.env.JWT_SECRET!, {expiresIn: "1d"})
}

const generateAuthToken = (userId: string) => {
    return jwt.sign({userId, type: 'auth'}, process.env.JWT_SECRET!, {expiresIn: "1d"})
}



const setAuthCookie = (res: Response, token: string) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
}


export const signUp = async (req: Request, res: Response) => {
    const { email } = req.body;
    if(!email) {
        return res.status(400).json({
            "message": "Email is required"
        })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            "message": "Invalid email format"
        })
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(409).json({
                "message": "User with this email already exists"
            })
        }

        const token = generateVerificationToken(email)
        const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`
        
        await transporter.sendMail({
            from: '"Super30 Contest" <banerjeebihan456@gmail.com>',
            to: email,
            subject: "Verify your email address",
            html: `
                <h2>Welcome to Super30 Contest!</h2>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verifyUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
                <p>Or copy and paste this link in your browser:</p>
                <p>${verifyUrl}</p>
                <p>This link will expire in 24 hours.</p>
            `
        })

        res.status(200).json({
            "message": "Verification email sent. Please check your email to complete registration."
        })

    } catch (error) {
        console.error("Signup error:", error)
        res.status(500).json({
            "message": "An error occurred while processing your request."
        })
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
        return res.status(400).json({
            message: "Invalid or missing token"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
            email: string; 
            type: string; 
        }
        
        // Ensure this is a verification token
        if (decoded.type !== 'verification') {
            return res.status(401).json({
                message: "Invalid token type"
            })
        }

        // Check if user already exists (edge case where someone tries to verify twice)
        const existingUser = await prisma.user.findUnique({
            where: { email: decoded.email }
        })

        if (existingUser) {
            // User already exists, just generate auth token and set cookie
            const authToken = generateAuthToken(existingUser.id)
            setAuthCookie(res, authToken)
            
            return res.status(200).json({
                message: "Email already verified. You are now logged in.",
                user: {
                    id: existingUser.id,
                    email: existingUser.email
                }
            })
        }

        // Create new user since email is now verified
        const newUser = await prisma.user.create({
            data: {
                email: decoded.email
            }
        })

        // Generate auth token with actual user ID
        const authToken = generateAuthToken(newUser.id)
        setAuthCookie(res, authToken)
        
        res.status(201).json({
            message: "Email verified successfully! Account created and you are now logged in.",
            user: {
                id: newUser.id,
                email: newUser.email
            }
        })

    } catch (error) {
        console.error("Email verification error:", error)
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Invalid or expired token"
            })
        }
        res.status(500).json({
            message: "An error occurred during email verification"
        })
    }
}