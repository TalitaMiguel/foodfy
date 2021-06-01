const express = require('express')
const routes = express.Router()

const SiteController = require('../../app/controllers/site/SiteController')

/*=== Routes Site ===*/
routes.get('/about', SiteController.about)
routes.get('/recipes', SiteController.recipes)
routes.get('/recipes/:id', SiteController.details)
routes.get('/chefs', SiteController.chefs)

module.exports = routes
