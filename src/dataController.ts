import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "./generated/prisma/client.js"
import type {Request, Response, ErrorRequestHandler} from "express"
import type { User, Departament } from './generated/prisma/client.js'
import "dotenv/config"
const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

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


class dataController {
    async createDepartament (req: Request, res: Response) {

        try {
                const departaments = await prisma.departament.create({
                data: createDepartament
              })
              console.log(res.statusCode)
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
             console.log('sss')
        try {
              const users = await prisma.user.findMany()
              res.json(users)
              console.log(res.statusCode)
        } catch (e) {
              console.log(e, 'sss')
        }

    }
}


export default new dataController()