const jwt = require('jsonwebtoken');

const isAuthenticated = function(req, res, next) {
    const access_token = req.session.access_token;
    console.log("token:" + access_token);
    if(!access_token)
        return res.status(401).redirect('/login');

    const user = verifyAuthToken(access_token);
    
    if(!user) 
        return res.status(401).redirect('/login');
    
    req.user = user;
    next();
}

const verifyAuthToken = function(token) {
    let user = null;
    user = jwt.verify(token, process.env.SECRET_TOKEN_JWT);
    return user;
}

const redirectDocuments = (req, res, next) => {
    if(req.session.access_token)
        return res.redirect('/documents');
    next();
}

module.exports = { isAuthenticated, redirectDocuments };