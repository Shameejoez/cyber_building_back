import express from 'express'
import dataController from './dataController.js'
import authController from './authController.js'
import { check } from 'express-validator'

const router = express()



router.get('/getDepartaments', dataController.getDepartaments)
router.post('/createUser', [
    check('email', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть длиннее 4, но не более 10 симолов').isLength({min: 4, max: 10})
], authController.registration)
router.get('/getUsers', dataController.getUsers)


export default router