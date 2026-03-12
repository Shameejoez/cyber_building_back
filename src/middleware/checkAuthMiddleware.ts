import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import {secret} from '../config.js'

export function chekAuthMiddleware (
    req: Request, 
    res: Response, 
    next: NextFunction) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        console.log('adaada')
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: "Пользователь не авторизован"})
        }

        const decodedData = jwt.verify(token, secret)
        req.user = decodedData

    } catch (error) {
        console.log(error)
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
}