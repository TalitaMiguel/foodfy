const db = require('../../config/db')
const Base = require('../models/Base')


Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async findRecipe(id) {
        try {
            const results = await db.query(`
                SELECT recipes.id,
                recipes.title,
                chefs.name AS author
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE chefs.id = $1
            `, [id])

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async files(id) {
        try {
            const results = await db.query(`
                SELECT files.*, chefs.file_id
                FROM files
                LEFT JOIN chefs ON (files.id = chefs.file_id)
                WHERE chefs.id = $1
                ORDER BY files.id ASC
            `, [id])

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async chefs() {
        try {
            const results =  await db.query(`
                SELECT chefs.*, count(recipes.id) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                GROUP BY chefs.id
                ORDER BY total_recipes DESC
            `) 

            return results.rows

        } catch (error) {
            console.error(error)
        }
    }
}