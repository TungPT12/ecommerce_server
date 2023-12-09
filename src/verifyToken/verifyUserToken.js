const jsonwebtoken = require('jsonwebtoken');
const getKeyEnvironmentVariable = require('../utils/getKeyEnvironmentVariable');

exports.verifyUserToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send(JSON.stringify({
                message: 'UnAuthorization'
            }));
        }
        const decoded = jsonwebtoken.verify(token, getKeyEnvironmentVariable('SECRET_KEY'));
        req.userId = decoded._id;
        next();
    } catch (error) {
        return res.status(403).json({
            message: 'UnAuthorization'
        });
    }
}

