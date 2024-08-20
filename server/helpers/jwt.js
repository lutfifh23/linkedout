var jwt = require('jsonwebtoken');

const signToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET);
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    signToken,
    verifyToken
}