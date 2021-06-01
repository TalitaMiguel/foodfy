async function post(req, res,next) {
    try {
        const { name } = req.body

        if (name == '' || req.files == '') {
            return res.render("admin/chefs/create", {
                chef: req.body,
                error: 'Por favor, preencha todos os campos.'
            })
        }

        next()
        
    } catch (error) {
        console.error(error)
    }
}

async function put(req, res,next) {
    try {
        const { name } = req.body

        if (name == '') {
            req.session.error = 'Por favor, preencha todos os campos.'
            return res.redirect('back')
        }

        next()
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    post,
    put
}