const Recipe = require('../models/Recipe')

async function post(req, res,next) {
    try {
        const keys = Object.keys(req.body)

        let chefOptions = await Recipe.chefsSelectOptions()

        for( key of keys) {
            if ( req.body[key] == "") {
                return res.render("admin/recipes/create", {
                    recipe: req.body,
                    chefOptions: chefOptions,
                    error: 'Por favor, preencha todos os campos.'
                }) 
            }
        }

        if (req.files.length == 0) {
            return res.render("admin/recipes/create", {
                recipe: req.body,
                chefOptions: chefOptions,
                error: 'Por favor, envie uma foto!'
            })
        }

        next()
        
    } catch (error) {
        console.error(error)
    }
}
  
async function put (req, res, next) {
    try {
        const { title, chef, ingredients, preparation, information } = req.body
    
        if ( title == "" || chef == "" || ingredients == "" || preparation == "" || information == "") {
            req.session.error = 'Por favor, preencha todos os campos.'
            return res.redirect('back')
        }

        next()
        
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    post,
    put
}