const Chefs = require('../../models/Chefs')
const File = require('../../models/file/File')
const Recipe = require('../../models/Recipe')
const { unlinkSync } = require('fs')

const LoadChefService = require('../../services/LoadChefService')

module.exports = {
    async index(req,res) {
        try {
            const error = req.session.error
            req.session.error = ""
      
            const success = req.session.success
            req.session.success = ""

            const userAdmin =  req.session.userAdmin
            const chefs = await LoadChefService.load('chefs')

            return res.render('admin/chefs/index', { chefs, userAdmin, error, success })

        } catch (error) {
            console.error(error)
        }
        
    },

    create(req,res) {
        return res.render("admin/chefs/create")
    },

    async post(req,res) {
        try {
            
            File.init({ table: 'files'})

            const file = req.files

            const filesPromise = file.map(file => File.create({
                name: file.filename,
                path: `/images/${file.filename}`
            }))

            let fileId = await Promise.all(filesPromise)
      
            let values = {
                name: req.body.name,
                file_id: JSON.parse(fileId)
            }

            let chefId = await Chefs.create(values)

            req.session.success = "Chef criado com sucesso!"

            return res.redirect(`/admin/chefs/${chefId}`)
        
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

            const chef = await LoadChefService.load('chef', {
                where: {
                    id: req.params.id
                }
            })

            let recipes = await Chefs.findRecipe(chef.id)

            async function getImage(recipeId) {
                let files = await Recipe.files(recipeId)
                files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)

                return files[0]
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            })

            recipes = await Promise.all(recipesPromise)

            return res.render("admin/chefs/show", { chef, recipes, userAdmin, error, success })

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

            const chef = await LoadChefService.load('chef', {
                where: {
                    id: req.params.id
                }
            })

            let recipes = await Chefs.findRecipe(chef.id)

            return res.render("admin/chefs/edit", { chef, recipes, error, success })

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
      
                let fileId = await Promise.all(newFilesPromise)
      
                let values = {
                    name: req.body.name,
                    file_id: JSON.parse(fileId),
                }
      
                await Chefs.update(id, values)
      
                await File.delete(req.body.file_id)
      
                return res.redirect(`/admin/chefs/${req.body.id}`)
            }
      
            let values = {
                name: req.body.name,
            }
      
            await Chefs.update(id, values)

            req.session.success = "Chef atualizado com sucesso!"
      
            return res.redirect(`/admin/chefs/${req.body.id}`)
    

        } catch (error) {
            console.error(error)
        }
    },

    async delete(req,res) {
        try {
            const { id } = req.body

            const file = await Chefs.files(id)

            await Chefs.delete(id) 

            file.map(async file => {
                unlinkSync(`public/${file.path}`)
            })

            await File.delete(file[0].id)

            req.session.success = "Chef deletado com sucesso!"

            return res.redirect("/admin/chefs")

        } catch (error) {
            console.error(error)
        }
    }
}