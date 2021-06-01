const User = require("../models/Users")


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

async function post(req, res,next) {
    try {
        const fillAllFields = checkAllFields(req.body)

        if (fillAllFields) {
            return res.render("admin/users/create", fillAllFields)
        }

        let { email } = req.body

        const user = await User.findOne({ 
            where: { email }
        })

        if (user) return res.render('admin/users/create', {
            user: req.body,
            error: 'Usuário já cadastrado'
        })

        next()
        
    } catch (error) {
        console.error(error)
    }
}

async function put(req, res,next) {
    try {
        const fillAllFields = checkAllFields(req.body)

        if (fillAllFields) {
            return res.render("admin/users/edit", fillAllFields)
        }

        const { id } = req.body
        const user = await User.findOne({ where: {id} })

        req.user = user

        next()
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    post,
    show,
    put
}