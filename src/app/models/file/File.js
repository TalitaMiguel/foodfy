const db = require('../../../config/db')
const { unlinkSync } = require('fs')

const Base = require('../Base')

Base.init({ table: 'files' })

module.exports = {
    ...Base,
    async deleteImage(id) {
        try {
            const result = await db.query(`
                SELECT * FROM files WHERE id = $1
            `, [id])

            const file = result.rows[0]

            unlinkSync(`public/${file.path}`)

            return db.query(`
                DELETE FROM files WHERE id = $1
            `, [id])

        } catch (error) {
            console.error(error)
        }
        
    }
}