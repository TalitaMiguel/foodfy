const Recipe = require('../../models/Recipe')
const LoadService = require('../../services/LoadRecipeService')

module.exports = {
    async index(req,res) {
        try {

            const { filter } = req.query

            if (!filter) return res.redirect("/")

            let recipes = await Recipe.search(filter)

            const recipesPromise = recipes.map(LoadService.format)
    
            recipes = await Promise.all(recipesPromise)
        
            return res.render("site/search", { recipes, filter }) 
            
        } catch (error) {
            console.error(error)
        }
    }
}