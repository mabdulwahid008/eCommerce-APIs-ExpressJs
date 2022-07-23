const jwt = require('jsonwebtoken')
require('dotenv').config();

const jwtGenertor = (user_id) =>{
    const payload={
        user_id : user_id 
    }
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn : '1hr'})
}

module.exports = jwtGenertor;