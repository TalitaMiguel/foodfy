const Recipe = require('../models/Recipe')

async function getImage(recipeId) {
    let files = await Recipe.files(recipeId)
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public", "").replace(/\\/g, "/" )}`
    }))

    return files
}

async function getChef(chefId) {
    const chef = await Recipe.findChefRecipes(chefId)
    return chef
}

async function format(recipe) {
    const files = await getImage(recipe.id)

    recipe.img = files[0].src
    recipe.files = files

    const chef = await getChef(recipe.chef_id)
    recipe.author = chef[0].chef_name

    return recipe
}


const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async recipe() {
        try {
            const recipe = await Recipe.findOne(this.filter)

            return format(recipe)
            
        } catch (error) {
            console.error(error)
        }
    },
    async recipes() {
        try {
            const recipes = await Recipe.findAll(this.filter)
            const recipesPromise = recipes.map(format)

            return Promise.all(recipesPromise)
            
        } catch (error) {
            console.error(error)
        }
    },
    format,
}


module.exports = LoadService