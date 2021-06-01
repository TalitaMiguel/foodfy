const Recipe = require('../../models/Recipe')
const File = require('../../models/file/File')
const { unlinkSync } = require('fs')

const LoadRecipeService = require('../../services/LoadRecipeService')


module.exports = {
    async index(req,res) {
        try {
            const error = req.session.error
            req.session.error = ""
      
            const success = req.session.success
            req.session.success = ""

            const userAdmin =  req.session
            
            const allRecipes = await LoadRecipeService.load('recipes')
            const lastAdded = await Promise.all(allRecipes)

            return res.render("admin/recipes/index", { recipes: lastAdded, userAdmin, error, success })

        } catch (error) {
            console.error(error)
        }
    },

    async create(req,res) {
        try {
            let chefOptions = await Recipe.chefsSelectOptions()

            return res.render("admin/recipes/create", { chefOptions })

        } catch (error) {
            console.error(error)
        }
    },

    async post(req,res) {
        try {
            
            File.init({ table: 'files' })

            const filesPromise = req.files.map(file => File.create({
                name: file.filename,
                path: `/images/${file.filename}`
            }))

            const filesIds = await Promise.all(filesPromise)

            const recipe = {
                chef_id: Number(req.body.chef),
                user_id: req.session.userId,
                title: req.body.title,
                ingredients: `{${req.body.ingredients}}`,
                preparation: `{${req.body.preparation}}`,
                information: req.body.information
            }

            const recipeId = await Recipe.create(recipe)


            File.init({ table: 'recipes_files' })

            const relationPromise = filesIds.map(id => File.create({
                recipe_id: recipeId,
                file_id: id
            }))

            await Promise.all(relationPromise)

            req.session.success = "Receita criada com sucesso!"

            return res.redirect(`/admin/recipes/${recipeId}`)

        } catch (error) {
            console.error(error)
        }

    },

    async show(req,res) {
        try {
            const error = req.session.error
            req.session.error = ""
      
            const success = req.session.success
            req.session.success = ""

            const userAdmin =  req.session

            const recipe = await LoadRecipeService.load('recipe', {
                where: {
                    id: req.params.id
                }
            })

            return res.render("admin/recipes/show", { recipe, error, success, userAdmin })

        } catch (error) {
            console.error(error)
        }
    },

    async edit(req,res) {
        try {
            const error = req.session.error
            req.session.error = ""
      
            const success = req.session.success
            req.session.success = ""

            const recipe = await LoadRecipeService.load('recipe', {
                where: {
                    id: req.params.id
                }
            })

            const chefOptions = await Recipe.chefsSelectOptions()

            return res.render("admin/recipes/edit", { recipe, chefOptions, error, success })

        } catch (error) {
            console.error(error)
        }
    },

    async put(req,res) {
        try {

            const { id } = req.body

            if (req.files.length != 0) {

                File.init({ table: 'files' })

                const newFilesPromise = req.files.map(file => File.create({
                    name: file.filename,
                    path: `/images/${file.filename}`
                }))
      
                let filesIds = await Promise.all(newFilesPromise)
      
                File.init({ table: 'recipes_files' })

                const relationPromise = filesIds.map(id => File.create({
                    recipe_id: req.body.id,
                    file_id: id
                }))

                await Promise.all(relationPromise)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.deleteImage(id))

                await Promise.all(removedFilesPromise)

            }

            const values = {
                chef_id: Number(req.body.chef),
                title: req.body.title,
                ingredients: `{${req.body.ingredients}}`,
                preparation: `{${req.body.preparation}}`,
                information: req.body.information,
            }
                
            await Recipe.update(id, values)

            req.session.success = "Receita atualizada com sucesso!"

            return res.redirect(`/admin/recipes/${req.body.id}`)

        } catch (error) {
            console.error(error)
        }
    },

    async delete(req,res) {
        try {

            const { id } = req.body

            const file = await Recipe.files(id)

            await Recipe.delete(id) 

            file.map(async file => {
                unlinkSync(`public/${file.path}`)
            })

            await File.delete(file[0].id)

            req.session.success = "Receita deletada com sucesso!"

            return res.redirect("/admin/recipes")
            
        } catch (error) {
            console.error(error)
        }
    }
}