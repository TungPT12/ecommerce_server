const User = require('../../../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({
            email: email,
            isDisable: false

        }).select('_id password email fullName cart avatar phoneNumber')

        if (!user) {
            return res.status(401).send(JSON.stringify({
                message: "Wrong username , email or password!",
                success: false
            }))
        }
        const isCorrectPassword = bcrypt.compareSync(password, user.password); // true
        if (!isCorrectPassword) {
            return res.status(401).send(JSON.stringify({
                message: "Wrong username , email or password!",
                success: false
            }))
        }
        const token = jwt.sign({
            _id: user._id,
        }, "mysecret", { expiresIn: '1d' });

        req.session.token = token;

        return res.send(JSON.stringify({
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            cart: user.cart,
            avatar: user.avatar,
            phoneNumber: user.phoneNumber,
            token: token,
        }));

    } catch (error) {
        if (error.message === 'jwt expired') {

        }
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}