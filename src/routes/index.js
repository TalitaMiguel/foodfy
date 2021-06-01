const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/site/HomeController')
const SearchController = require('../app/controllers/site/SearchController')

const recipes = require('./admin/recipes')
const chefs = require('./admin/chefs')
const site = require('./site/site')
const users = require('./admin/users')
const profile = require('./admin/profile')


/*=== Routes ===*/
routes.get('/', HomeController.index)
routes.get('/search', SearchController.index)

routes.use('/admin/users', users)
routes.use('/admin/profile', profile)
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)
routes.use('/site', site)


/*=== Alias ===*/
routes.get('/account', function(req, res) {
    return res.redirect("/admin/users/login")
})

/*=== Not Found ===*/
routes.use(function(req, res) {
    res.status(404).render("site/not-found")
})


module.exports = routes