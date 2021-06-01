const Base = require('../models/Base')
const db = require('../../config/db')

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async findBy(filter) {
        try {
            const results =  await db.query(`
                SELECT recipes.*, chefs.name AS author
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.title ILIKE '%${filter}%'
                ORDER BY recipes.id ASC
            `)

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async files(id) {
        try {
            const results =  await db.query(`
                SELECT files.*, recipe_id, file_id 
                FROM files
                LEFT JOIN recipes_files
                ON (files.id = recipes_files.file_id)
                WHERE recipes_files.recipe_id = $1
            `, [id])

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async chefsSelectOptions() {
        try {
            const results =  await db.query(`SELECT id, name FROM chefs`)

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async search(filter) {
        try {
            const results = await db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.title ILIKE '%${filter}%'
                ORDER BY updated_at DESC
            `)

            return results.rows
            
        } catch (error) {
            console.error(error)
        }
    }
}