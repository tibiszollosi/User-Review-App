//authentication Middleware

function requireLogin(req, res, next) {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login'); // Redirect to login page
    }
}

module.exports = {
    requireLogin
};

/*

export default {
    requireLogin
};
*/