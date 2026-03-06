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

type TokenUserData = Pick<User, "id" | "role">

const generateAccessToken = ({id, role}: TokenUserData) => {
    const payload = {
        id,
        role
    }

    return jwt.sign(payload, secret, {expiresIn: '24h'})
}


const createdUser: User = {
    departamentId: 1,
    email: 'bubaluba@gmail.com',
    id: 100,
    name: 'Борис',
    surename: 'Хрящев',
    password: '',
    workPlace: 'Отдел монолитного строительста',
    role: 'Монолитчик',
    createdAt: new Date(),
    updatedAt: new Date()
}

class authController {

    async registration (req: Request, res: Response) {
                
        try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(400).json({message: 'Ошибка регистрации', errors})
                }
                const {email, password} = req.body
                const current = await prisma.user.findFirst({
                    where: {email: email}
                })
                if (current) {
                    return res.status(400).json({message: "Пользователь с таким email уже существует"})
                }
                const hachPassword = bcrypt.hashSync(password, 10)
                const newUser = {...createdUser,
                    password: hachPassword
                }
                    await prisma.user.create({
                    data: newUser
                })
                return res.json({message: 'Пользователь успешно зарегестрирован'})
        } catch (e) {
               console.log(e)
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
            const token = generateAccessToken({id: current.id, role: current.role})
            return res.json(token)
        } catch (error) {
            
        }
    }
}


export default new authController()