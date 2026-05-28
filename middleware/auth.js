const {validateToken} = require('../services/auth')

function checkCookieToken(token){
    return async(req,res,next)=>{

        const cookietoken = req.cookies[token];
        if(!cookietoken){
            req.user = null;
            return next()
        }

        try {
            // console.log('token',cookietoken)
            const payload = validateToken(cookietoken)
            // console.log(payload,'payload')
            req.user = payload
        } catch (error) {
            console.error('Invalid token:', error);
            req.user = null;
        }
        next();
    }
}

module.exports = {checkCookieToken}