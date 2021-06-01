const express = require('express')
const routes = express.Router()

const ProfileController = require('../../app/controllers/users/ProfileController')
const ProfileValidator = require('../../app/validators/profile')

/*=== Routes Profile ===*/
routes.get('', ProfileValidator.show, ProfileController.index)
routes.put('/', ProfileValidator.put, ProfileController.put)

module.exports = routes
