import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "./generated/prisma/client.js"
import type {Request, Response, ErrorRequestHandler} from "express"
import type { User, Departament } from './generated/prisma/client.js'
import { prisma } from './dataController.js'


type changedUserData = Partial<Omit<User, 'id'>> & Pick<User, 'id'>


class patchController {

    async patchUser (req:Request, res:Response) {
        const {id, ...changedData} = req.body as changedUserData

        try {
          const user = await prisma.user.update({
                where: { id },
                data: changedData
            })
            res.status(200).json(user)
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Ошибка обновления" })
        }


    }
}

export default new patchController()