const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorization = async(req, res, next)=>{
    try {
        //get token from reuest header
        const token = req.header('token');
    
        //if token is not provided
        if(!token){
            return res.status(403).json({message: 'Not Authorize'})
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.user_id = payload.user_id;
        next();
        
    } catch (error) {
        console.log(error.message);
        res.status(403).json({message: 'Not Authorize'})
    }

}

module.exports = authorization