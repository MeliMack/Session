function setUserByCookie(req, res, next) {
    if(req.cookies.userCookie != undefined) {
        req.session.user = req.cookies.userCookie;
        console.log("SE CREO UNA SESION EN BASE A LA COOKIE, BROOOO")
    }
    next();
}

module.exports = setUserByCookie;