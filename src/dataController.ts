import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "./generated/prisma/client.js"
import type {Request, Response, ErrorRequestHandler} from "express"
import type { User, Departament } from './generated/prisma/client.js'
import "dotenv/config"
import bcrypt from 'bcrypt'
import { users } from './utils/createUsers.js'

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

type gettyUsersData = Partial<Pick<User, 'departamentId' | 'name' | 'surename' | 'workPlace' | 'role'>>


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
              console.log(e, 'Ошибка при получении пользователя');
              res.status(500).json({message: "Внутренняя ошибка сервера"});
        }

    }

    async getUser (req: Request, res: Response) {
        const id = req.params.id as string
        try {
            if(!id || !parseInt(id) ) {
               return res.status(400).json({message: "В запросе нет id"})
                
            } 
            
            const numId = parseInt(id)

            const user = await prisma.user.findUnique({
                where: {id: numId},
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

              if (!user) {
               return res.status(404).json({message: "Пользователь не найден"});

              }

              res.json(user)
              console.log(res.statusCode)

        } catch (e) {
              console.log(e, 'Ошибка при получении пользователя');
              res.status(500).json({message: "Внутренняя ошибка сервера"});
        }

    }

    async addManyUsers (req: Request, res: Response) {
       const data = users
        console.log('pusk')
        try {
            await prisma.user.createMany({
            data: data,
            skipDuplicates: true,
        })

        return res.status(200).json({message: `Успешно добавленно ${data.length} пользователей`})

        } catch (e) {
            console.log("Ошибка создания")
        }
        
    } 
    // тестовый запрос
    //Поиск юзеров по опциональным полям
    async gettyUsers (req: Request, res: Response) {
        const serchedData = req.body as gettyUsersData

        try {
             const users = await prisma.user.findMany({
                where: {
                      ...(serchedData.name && {
                          name: {contains: serchedData.name},
                      }),
                      ...(serchedData.surename && {
                          surename: {contains: serchedData.surename},
                      }),
                      ...(serchedData.workPlace && {
                          workPlace: {contains: serchedData.workPlace},
                      }),
                      ...(serchedData.role && {
                          role: {equals: serchedData.role},
                      }),
                      ...(serchedData.departamentId && {
                          departamentId: {equals: serchedData.departamentId},
                      }),  
  
                    },
                });

                res.json(users).status(200).json({message: 'Юзер лист готов'})
        } catch (e) {
            console.error('Failed to fetch users:', e);
            res.status(500).json({ 
            message: 'Ошибка сервера' 
        });
        }

    }
}


export default new dataController()