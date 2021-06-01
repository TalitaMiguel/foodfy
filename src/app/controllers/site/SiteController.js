const Recipe = require('../../models/Recipe')

const LoadRecipeService = require('../../services/LoadRecipeService')
const LoadChefService = require('../../services/LoadChefService')

module.exports = {
    about(req,res) {
        return res.render('site/about')
    },

    async recipes(req,res) {
        try {

            const allRecipes = await LoadRecipeService.load('recipes')
            const recipes = await Promise.all(allRecipes)
            
            return res.render("site/recipes", { recipes })
            
        } catch (error) {
            console.error(error)
        }

    },

    async details(req, res) {
        try {
            const recipe = await LoadRecipeService.load('recipe', {
                where: {
                    id: req.params.id
                }
            })
        
            return res.render("site/details", { recipe })
            
        } catch (error) {
            console.error(error)
        } 
    },

    async chefs(req, res) {
        try {

            const allChefs = await LoadChefService.load('chefs')
            const chefs = await Promise.all(allChefs)
            
            return res.render("site/chefs", { chefs })

        } catch (error) {
            console.error(error)
        } 
    },
    
    async search(req, res) {
        try {
            const { filter } = req.query

            if (filter) {
                let recipes = await Recipe.findBy(filter)
                    
                return res.render("site/search", { filter, recipes })  
            }
            
        } catch (error) {
            console.error(error)
        } 
        
    }
}