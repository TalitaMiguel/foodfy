const User = require('../models/Users')
const { compare } = require('bcryptjs')


async function login(req, res, next) {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ where: {email} })

        if (!user) return res.render("session/login", {
            user: req.body,
            error: "Usuário não cadastrado!"
        })

        const passed = await compare(password, user.password)

        if(!passed) return res.render("session/login", {
            user: req.body,
            error: "Senha incorreta."
        })

        req.user = user

        next()
        
    } catch (error) {
        console.error(error)
    }
}

async function forgot(req, res, next) {
    try {
        const { email } = req.body

        let user = await User.findOne({ where: {email} })

        if(!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "Email não cadastrado!"
        })

        req.user = user

        next()
        
    } catch (error) {
        console.error(error)
    }
}

async function reset(req, res, next) {
    try {
        const { email, password, token, passwordRepeat } = req.body

        const user = await User.findOne({ where: {email} })
        
        if (email == "" || password == "" || passwordRepeat == "") {
            req.session.error = 'Por favor, preencha todos os campos.'
            return res.redirect('back')
        } 
        
        if (!user) {
            req.session.error = 'Usuário incorreto!'
            return res.redirect('back')
        }  
        
        if (password != passwordRepeat) {
            req.session.error = 'As senhas estão incorretas!'
            return res.redirect('back')
        }
        
        if (token != user.reset_token) return res.render('session/login', {
            user: req.body,
            token,
            error: 'Token inválido! Solicite uma nova recuperação de senha.'
        })

        let now = new Date()
        now = now.setHours(now.getHours())

        if (now > user.reset_token_expires) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token expirado! Solicite uma nova recuperação de senha.'
        })

        req.user = user

        next()
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    login,
    forgot,
    reset
}