const User = require('../../../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const getKeyEnvironmentVariable = require('../../../utils/getKeyEnvironmentVariable');

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({
            email: email,
            isDisable: false
        });

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

        if (user.isAdmin) {
            console.log(getKeyEnvironmentVariable('SECRET_KEY'))
            const token = jwt.sign({
                _id: user._id,
                isAdmin: user.isAdmin
            }, getKeyEnvironmentVariable('SECRET_KEY'), { expiresIn: '1d' });

            req.session.token = token;
            req.session.isAuthn = true;
            return res.send(JSON.stringify({
                ...user._doc,
                token: token
            }));
        }
        return res.status(403).send(JSON.stringify({
            message: "Not permission!",
            success: false
        }))

    } catch (error) {
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}