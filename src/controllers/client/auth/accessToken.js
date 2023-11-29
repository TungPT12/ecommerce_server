const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

exports.isAccessToken = async (req, res) => {
    try {
        const token = req.session.token;
        if (!token) {
            return res.status(401).send(JSON.stringify({
                message: 'UnAuthorization'
            }));
        }
        const decoded = jwt.verify(token, 'mysecret');
        const userId = decoded._id;
        let user = await User.findOne({ _id: userId }).select('_id email fullName cart avatar phoneNumber')
        if (user) {
            return res.send(JSON.stringify({
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                cart: user.cart,
                avatar: user.avatar,
                phoneNumber: user.phoneNumber,
                token: token,
            }));
        }
        return res.status(403).send(JSON.stringify({
            success: false
        }))
    } catch (error) {
        req.session.destroy((error) => {
            console.log(error)
        })
        return res.status(403).send(JSON.stringify({
            message: 'UnAuthorization'
        }));
    }
}