const LoadService = require('../../services/LoadRecipeService')

module.exports = {
    async index(req,res) {
        try {

            const allRecipes = await LoadService.load('recipes')
            const recipes = allRecipes.filter((recipe, index) => index > 5 ? false : true)

            return res.render('site/home', { recipes })
            
        } catch (error) {
            console.error(error)
        }
    }
}