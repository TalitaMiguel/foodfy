function  onlyAdmin(req, res, next) {
    if(!req.session.userId) {
        return res.redirect('/')
    }

    next()
}

function isAdmin (req, res, next) {
    if(!req.session.userAdmin) {
        return res.redirect('/admin/profile')
    }
  
    next()
}

module.exports = {
    onlyAdmin,
    isAdmin
}