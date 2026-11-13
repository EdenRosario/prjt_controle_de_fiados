import { Router } from "express";
import * as userController from '../controllers/user.controller.js'

const router = Router()

router.post('/register', userController.createUser)

router.post('/login', userController.searchUser)

router.post('/recover', userController.validateRecovery)

router.post('/autenticar', userController.autentincarDados)    

router.post('/recuperar-usuario', userController.recuperarUsuario)

router.get('/', userController.listarTodosUsuarios)

router.put('/:id', userController.update)

router.put('/:userId', userController.mudarSenha)

router.put('/atualizar/:userId', userController.atualizarInformacoes)

export default router 