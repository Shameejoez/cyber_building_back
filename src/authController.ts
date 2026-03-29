import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "./generated/prisma/client.js"
import type {Request, Response, ErrorRequestHandler} from "express"
import type { User, Departament } from './generated/prisma/client.js'
import "dotenv/config"
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import {secret} from './config.js'

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
                console.log('sssssss')
        try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(403).json({message: 'Ошибка регистрации', errors})
                }
                const {email, password} = req.body
                const current = await prisma.user.findFirst({
                    where: {email: email}
                })
                if (current) {
                    return res.status(403).json({message: "Пользователь с таким email уже существует"})
                }
                const hachPassword = bcrypt.hashSync(password, 10)
                const newUser = {...createdUser,
                    password: hachPassword
                }
                    console.log(newUser)
                    await prisma.user.create({
                    data: newUser
                })
                return res.json({message: 'Пользователь успешно зарегестрирован'})
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
            return res.json(token)
        } catch (error) {
            
        }
    }
}


export default new authController()