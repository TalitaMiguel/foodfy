
const express = require('express')
const routes = express.Router()

const SessionController = require('../../app/controllers/users/SessionController')
const UserController = require('../../app/controllers/users/UserController')

const UserValidator = require('../../app/validators/user')
const SessionValidator = require('../../app/validators/session')

const { isAdmin, onlyAdmin } = require('../../app/middlewares/session')

// login/logout 
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

// user register / UserController
routes.get('/create', isAdmin, UserController.create)
routes.get('/:id/edit', isAdmin, UserController.edit)
routes.get('/list', onlyAdmin, isAdmin, UserController.list)

routes.post('/', UserValidator.post, UserController.post)
routes.put('/', UserValidator.put, UserController.put)
routes.delete('/', UserController.delete)


module.exports = routes
