require('dotenv').config();
const jwt = require('jsonwebtoken'); 
const generateApiToken = ()=>{
    const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = generateApiToken;