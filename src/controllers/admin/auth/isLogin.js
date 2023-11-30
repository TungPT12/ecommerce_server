const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const getKeyEnvironmentVariable = require('../../../utils/getKeyEnvironmentVariable');

exports.isLogin = async (req, res) => {
    try {
        const token = req.session.token;
        if (!token) {
            return res.status(401).send(JSON.stringify({
                message: 'UnAuthorization'
            }));
        }
        const decoded = jwt.verify(token, getKeyEnvironmentVariable('SECRET_KEY'));
        const userId = decoded._id;
        let user = await User.findOne({ _id: userId }).select('-password')

        if (user) {
            if (user.isAdmin) {
                return res.send(JSON.stringify({
                    ...user._doc,
                    token: token,
                    success: true,
                }));
            }
        }
        return res.status(403).send(JSON.stringify({
            success: false
        }))
    } catch (error) {
        console.log(error.message)
        return res.status(401).send(JSON.stringify({
            message: 'UnAuthorization'
        }));
    }
}