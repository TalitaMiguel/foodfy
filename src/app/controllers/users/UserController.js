const User = require("../../models/Users")
const Recipe = require("../../models/Recipe")

const { hash } = require('bcryptjs')
const { randomPassword } = require('../../../lib/randomPassword')

const { unlinkSync } = require('fs')
const mailer = require('../../../lib/mailer')

const email = (userName, userEmail, userPassword) => `
    <h2>Olá ${userName}.</h2>
    <p>Sua conta no Foodfy foi criada com sucesso!</p>
    <p>Segue seus dados de usuário:</p>
    <p>login: ${userEmail}</p>
    <p>senha: ${userPassword}</p>
    <p></br></p>
    <p>
        Valide sua conta, clique <a href="http://localhost:3000/admin/users/login">
        <strong>aqui.</strong></a>
    </p> 
`

module.exports = {

    create(req, res) {
        return res.render("admin/users/create")
    },

    async show(req, res) {
        try {
            const { user } = req
            return res.render("admin/users/index", { user })
    
        } catch (error) {
            console.error(error)
        }
    },
        
    async post(req,res) {
        try {
            const password = randomPassword(8)

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-replay@foodfy.com.br',
                subject: 'Cadastro realizado',
                html: email(req.body.name, req.body.email, password)
            })
          
            let passwordHash = await hash(password, 8)

            await User.create ({
                name: req.body.name,
                email: req.body.email, 
                password: passwordHash,
                is_admin: req.body.is_admin || 0
            })

            const usersList = await User.findAll()

            return res.render('admin/users/list', {
                userId: req.session.userId,
                users: usersList,
                success: 'Usuário criado com sucesso!'
            })

        } catch (err) {
            console.error(err)
        }
       
    },

    async edit(req, res) {
        try {
            const { id } = req.params
      
            let user = await User.findOne({ where: { id } })
      
            user = {
              ...user,
              firstName: user.name.split(" ")[0],
            }
      
            return res.render('admin/users/edit', { user })
      
        } catch (error) {
            console.error(error)
        } 
    },

    async put(req,res) {
        try {
            const { user } = req

            let { name, email, is_admin } = req.body

            is_admin = is_admin || false
        
            await User.update(user.id, {
                name, 
                email, 
                is_admin
            })
        
            return res.render('admin/users/edit', {
                user: req.body,
                success: 'Usuário atualizado com sucesso!'
            })
            
        } catch (error) {
            console.error(error)

            return res.render("admin/users/edit"), {
                error: "Ocorreu um erro!"
            }
        }
    },

    async delete(req, res) {
        try {
            const recipes = await Recipe.findAll({ where: { user_id: req.body.id } })

            const allFilesPromise = recipes.map(recipe => Recipe.files(recipe.id))

            let promiseResults = await Promise.all(allFilesPromise)

            await User.delete(req.body.id)

            promiseResults.map(results => {
                results.rows.map(file => {
                    try {
                        unlinkSync(file.path)
                    } catch (error) {
                        console.error(error)
                    }
                })
            })
            
            const usersList = await User.findAll()

            return res.render('admin/users/list', {
                userId: req.session.userId,
                users: usersList,
                success: "Conta deletada com sucesso!"
            })
            
        } catch (error) {
            console.error(error)

            return res.render("admin/users/index"), {
                user: req.body,
                error: "Ocorreu um erro ao tentar deletar sua conta!"
            }
        }
    },

    async list(req, res) {
        try {
            const usersList = await User.findAll()
    
            return res.render('admin/users/list', {
                userId: req.session.userId,
                users: usersList
            })
    
        } catch (error) {
            console.error(error)
        }
    }
}