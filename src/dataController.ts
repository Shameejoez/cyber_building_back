import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "./generated/prisma/client.js"
import type {Request, Response, ErrorRequestHandler} from "express"
import type { User, Departament } from './generated/prisma/client.js'
import "dotenv/config"
import bcrypt from 'bcrypt'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
export const prisma = new PrismaClient({ adapter: pool })

const createDepartament: Departament = {
    brigaderId: null,
    foremanId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 1,
    name: 'Отдел монолитного строительста',
}

const createdUser: User = {
    departamentId: 1,
    email: 'ba@gmail.com',
    id: 100,
    name: 'Максуд',
    surename: 'Шпателев',
    password: '54321',
    workPlace: 'Отдел монолитного строительста',
    role: 'Монолитчик',
    createdAt: new Date(),
    updatedAt: new Date()
}


class dataController {
    async createDepartament (req: Request, res: Response) {

        try {
                const departaments = await prisma.departament.create({
                data: createDepartament
              })
              res.json(res.status).json(departaments)
        } catch (e) {
              console.log(e)
        }

    }

    async getDepartaments (req: Request, res: Response) {

        try {
              const departaments = await prisma.departament.findMany()
              res.json(departaments)
              console.log(res.statusCode)
        } catch (e) {
              console.log(e)
        }

    }

    async getUsers (req: Request, res: Response) {
        try {
              const users = await prisma.user.findMany({
                select: {
                        departamentId: true,
                        email: true,
                        id: true,
                        name: true,
                        surename: true,
                        workPlace: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true
                }
              })
              res.json(users)
              console.log(res.statusCode)
        } catch (e) {
              console.log(e, 'sss')
        }

    }

    async getUser (req: Request, res: Response) {
        const {id} = req.body as Pick<User, 'id'>
        try {
            const users = await prisma.user.findUnique({
                where: {id},
                select: {
                        departamentId: true,
                        email: true,
                        id: true,
                        name: true,
                        surename: true,
                        workPlace: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true
                }
            })
              res.json(users)
              console.log(res.statusCode)
        } catch (e) {
              console.log(e, 'sss')
        }


    }
}


export default new dataController()