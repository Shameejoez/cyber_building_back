import express from 'express'
import dataController from './dataController.js'
import authController from './authController.js'
import { check } from 'express-validator'
import { chekAuthMiddleware } from './middleware/checkAuthMiddleware.js'
import { isAdminMiddleware } from './middleware/chekAdminRole.js'
import patchController from './patchController.js'
const router = express.Router()

router.get('/getDepartaments', dataController.getDepartaments)
router.post('/registration',
    [
      /*   chekAuthMiddleware, */
        check('email', 'Имя пользователя не может быть пустым').notEmpty(),
        check('password', 'Пароль должен быть длиннее 4, но не более 10 симолов').isLength({min: 4, max: 10})
    ], authController.registration)

router.get('/getUsers', [isAdminMiddleware], dataController.getUsers)
router.get('/getUser', [isAdminMiddleware], dataController.getUser)
router.post('/login', authController.login)
router.post('/createUser', [isAdminMiddleware], authController.registration)
router.patch('/patchUser', [isAdminMiddleware], patchController.patchUser)

export default router