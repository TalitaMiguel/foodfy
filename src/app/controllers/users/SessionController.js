const User = require('../../models/Users')

const { hash } = require('bcryptjs')

const crypto = require('crypto')
const mailer = require('../../../lib/mailer')

module.exports = {

    loginForm(req, res) {
        return res.render("session/login")
    },

    login(req, res) {
        try {
            req.session.userId = req.user.id
            req.session.userAdmin = req.user.is_admin

            return res.redirect("/admin/users/list")

        } catch (error) {
            console.error(error)
        }
    },

    logout(req, res) {
        try {
            req.session.destroy()
            return res.redirect("/")
            
        } catch (error) {
            console.error(error)
        }
    },

    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },

    async forgot(req, res) {
        try {
            const user = req.user

            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                html:`
                    <h2>Esqueceu a senha?</h2>
                    <p>Não se preocupe, clique no link abaixo para recuperá-la</p>
                    <p>
                        <a 
                            href="http://localhost:3000/admin/users/password-reset?token=${token}" 
                            target="_blank"
                        >
                            RECUPERAR SENHA
                        </a>
                    </p>
                `,
            })

            return res.render("session/forgot-password", {
                success: "Verifique o seu email para resetar sua senha!"
            })
            
        } catch (error) {
            console.error(error)

            return res.render("session/forgot-password", {
                error: "Ocorreu um erro, tente novamente!"
            })
        }
    },

    resetForm(req, res) {
        try {
            const error = req.session.error
            req.session.error = ""
      
            const success = req.session.success
            req.session.success = ""

            return res.render("session/password-reset", { token: req.query.token, error, success })
            
        } catch (error) {
            console.error(error)
        }
    },

    async reset(req, res) {
        try {
            const user = req.user
            const { password, token } = req.body
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            return res.render("session/login", {
                user: req.body,
                success: "Senha atualizada! Faça o seu login"
            })
            
        } catch (error) {
            console.error(error)
            
            return res.render("session/password-reset", {
                user: req.body,
                token,
                error: "Ocorreu um erro, tente novamente!"
            })
        }
    }
}