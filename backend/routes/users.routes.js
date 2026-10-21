import { Router } from "express";
import * as userController from '../controllers/user.controller.js'

const router = Router()

router.post('/register', userController.createUser)

router.post('/login', userController.searchUser)

router.post('/recover', userController.validateRecovery)

router.put('/:id', userController.update)

export default router 