import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "./generated/prisma/client.js"
import type {Request, Response, ErrorRequestHandler} from "express"
import type { User, Departament } from './generated/prisma/client.js'
import "dotenv/config"
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import {secret} from './config.js'
import { revokedToken, revokeToken } from './utils/blacklist.js'


const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

export type TokenUserData = Pick<User, "email" | "role">
type loginUserData = Pick<User, "password" | "email">

const generateAccessToken = ({role, email}: TokenUserData) => {
    const payload = {
        email,
        role
    }

    return jwt.sign(payload, secret, {expiresIn: '24h'})
}


const loginData: loginUserData = {
    email: 'bubaluba@gmail.com',
    password: '12345',
}

const createdUser : Omit<User, "id" | 'createdAt' | 'updatedAt'> = {
    departamentId: 1,
    email: 'maksud@gmail.com',
    name: 'Максуд',
    surename: 'Шпателев',
    password: '54321',
    workPlace: 'Отдел монолитного строительста',
    role: 'Монолитчик',
}

class authController {

    async registration (req: Request, res: Response) {

        try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(403).json({message: 'Ошибка регистрации', errors})
                }
                const data: Omit<User, 'createdAt' | 'updatedAt' | 'id'> = req.body 
                const current = await prisma.user.findFirst({
                    where: {email: data.email!}
                })
                if (current) {
                    return res.status(403).json({message: "Пользователь с таким email уже существует"})
                }
                const hachPassword = bcrypt.hashSync(data.password!, 10)
                const newUser = {...data,
                    password: hachPassword
                }
                   console.log(newUser)
                   const addedUsser = await prisma.user.create({
                    data: newUser
                })
                return res.json({message: 'Пользователь успешно зарегестрирован'}, ).json(addedUsser)
        } catch (e) {
               console.log(e, 't')
        }
    }

    async login (req: Request, res: Response) {
        
        try {
            const {email, password} = req.body
            const current = await prisma.user.findFirst({
                    where: {email: email}
                })
            const validPassword = bcrypt.compareSync(password, current?.password!)
                if (!current || !validPassword) {
                   return res.status(400).json({message: "Неверный email или пароль"})
                }
            const token = generateAccessToken({email: current.email, role: current.role})
            console.log(token)
            console.log(current)
            return res.json(token)
           
        } catch (error) {
            
        }
    }

    async logout (req: Request, res: Response) {
        let decoded: jwt.JwtPayload

        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({message: 'Токен отсутствует'})
         }  

        try {
            
           decoded = jwt.verify(token, secret) as jwt.JwtPayload

        } catch (error) {   

            if (error instanceof jwt.TokenExpiredError) {
                // Токен истёк - не добавляем в чёрный список, просто выходим
                return res.status(200).json({ message: 'Выход выполнен (токен уже истёк)' })
            }
            return res.status(401).json({ message: 'Невалидный токен' })
        }
        
        // вычисляем сколько времени осталось жить токену
        const remainingTime = decoded.exp! - Math.floor(Date.now() / 1000)
        if (remainingTime > 0) {
            revokeToken(token, remainingTime)
        }

        return res.status(200).json({message: "Успешный выход"})
    }
}


export default new authController()