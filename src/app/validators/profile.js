const User = require("../models/Users")
const { compare } = require('bcryptjs')


function checkAllFields(body) {
    try {
        const keys = Object.keys(body) 

        for( key of keys) {
            if (body[key] == "") {
                return {
                    user: body,
                    error: 'Por favor, preencha todos os campos.'
                }
            }
        }
        
    } catch (error) {
        console.error(error)
    }
}

async function show(req, res, next) {
    try {
        const { userId: id } = req.session

        const user = await User.findOne({ where: {id} })

        if (!user) return res.render("admin/users/create", {
            error: "Usuário não encontrado!"
        })

        req.user = user

        next()
        
    } catch (error) {
        console.error(error)
    }
}

async function put(req, res,next) {
    try {
        const fillAllFields = checkAllFields(req.body)
        if (fillAllFields) return res.render('admin/users/profile', fillAllFields)

        const { userId: id } = req.session
        const { email, password } = req.body
        
        const user = await User.findOne({ where: { id } })

        if (email != user.email) {
            const isNotAvaliable = await User.findOne({ where: { email } })

            if (isNotAvaliable) return res.render('admin/users/profile', {
                user: req.body,
                error: 'Este email já está cadastrado!'
            })
        }

        if (!password) return res.render('admin/users/profile', {
            user: req.body,
            error: 'Insira sua senha para atualizar seu cadastro.'
        })
    
        const passwordPassed = await compare(password, user.password)

        if (!passwordPassed) return res.render('admin/users/profile', {
            user: req.body,
            error: 'Senha incorreta!'
        })

        req.user = user

        next()
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    show,
    put
}