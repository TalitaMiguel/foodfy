const express = require('express')
const routes = express.Router()
const multer = require('../../app/middlewares/multer')
const RecipesController = require('../../app/controllers/admin/RecipesController')

const RecipeValidator = require('../../app/validators/recipe')

const { onlyAdmin } = require('../../app/middlewares/session')


/*=== Routes Admin Recipes ===*/
routes.get('/', onlyAdmin, RecipesController.index)

routes.get('/create', onlyAdmin, RecipesController.create)
routes.get('/:id', RecipesController.show)
routes.get('/:id/edit', onlyAdmin, RecipesController.edit)

routes.post('/', multer.array("photos", 5), RecipeValidator.post, RecipesController.post)
routes.put('/', multer.array("photos", 5), RecipeValidator.put, RecipesController.put)
routes.delete('/', onlyAdmin, RecipesController.delete)

module.exports = routes
