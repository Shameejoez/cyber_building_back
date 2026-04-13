import type { Request, Response, NextFunction } from "express"
 import jwt from "jsonwebtoken"
import {secret} from '../config.js'
import type { TokenUserData } from "../authController.js"
import { revokedToken } from "../utils/blacklist.js"


export function isAdminMiddleware (
    req: Request, 
    res: Response, 
    next: NextFunction) {
    if (req.method === "OPTIONS") {
        next()
    }
   

    try {
         const token = req.headers.authorization?.split(' ')[1]
         if (!token) {
           return res.status(403).json({message: 'Пользователь не авторизован'})
         }
         if (revokedToken.get(token)) {
                    return res.status(401).json({message: 'Невалидный токен'})
                 } else { console.log('vse ok')
                    revokedToken.keys()
                    console.log('vse ok')
                 }
         const {role} = jwt.verify(token, secret) as TokenUserData

         if (role !== 'Админ') {
             return res.status(403).json({message: 'У данной роли отсутствуют права'})
         }

         next()
         
    } catch (error) {
        console.log(error)

    }
}