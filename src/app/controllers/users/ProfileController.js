const User = require("../../models/Users")

module.exports = {

    async index(req, res) {
        try {
            const { user } = req
            
            return res.render("admin/users/profile", { user })
    
        } catch (error) {
            console.error(error)
        }
    },
        

    async put(req,res) {
        try {
            const { id } = req.body
        
            let user = {
                name: req.body.name,
                email: req.body.email,
                is_admin: req.body.is_admin
            }
        
            user.is_admin = user.is_admin || false
        
            await User.update(id, user)

            return res.render("admin/users/profile", {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            })
            
        } catch (error) {
            console.error(error)
            
            return res.render("admin/users/profile"), {
                error: "Ocorreu um erro!"
            }
        }
    }
}