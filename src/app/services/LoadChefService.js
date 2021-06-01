const Chefs = require('../models/Chefs')

async function getImages(chefId) {
    let files = await Chefs.files(chefId)
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }))

    return files

}

async function format(chef) {
    const files = await getImages(chef.id)

    chef.img = files[0].src
    chef.files = files

    return chef
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async chef() {
        try {
            const chef = await Chefs.findOne(this.filter)

            return format(chef)
            
        } catch (error) {
            console.error(error)
        }
    },
    async chefs() {
        try {
            const chefs = await Chefs.chefs(this.filter)
            const chefsPromise = chefs.map(format)

            return Promise.all(chefsPromise)
            
        } catch (error) {
            console.error(error)
        }
    },
    format,
}


module.exports = LoadService