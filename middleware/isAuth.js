const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // there are 2 ways 
    // const headertoken = req.headers.authorization;
    // console.log(" ' "+headertoken+" ' ");
    // console.log(" ' "+token+" ' ");
    // if(headertoken === token){console.log("it's the same");}

    const token = req.get('Authorization');
    if(!token){
        return res.status(401).json({
            message: 'Token not found'
        })
    }
    let decodedToken = jwt.verify(token,'somesupersecretsecret');
    if(!decodedToken){
        return res.status(401).json({
            message: 'Sorry You Are Unauthorized'
        })
    }
    req.user_ID = decodedToken.user_ID;
    req.name = decodedToken.name;
    req.email = decodedToken.email;
    next();
    
}