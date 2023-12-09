const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const getKeyEnvironmentVariable = require('../../utils/getKeyEnvironmentVariable');

exports.signin = async (req, res) => {
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
        }, getKeyEnvironmentVariable('SECRET_KEY'), { expiresIn: '1d' });

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

exports.signup = async (req, res) => {
    try {
        const { password, fullName, email, phoneNumber, } = req.body;
        let isDuplicateEmail = await User.findOne({ email: email })
        if (isDuplicateEmail) {
            return res.status(400).send(JSON.stringify({
                message: "Duplicate Email",
                success: false
            }))
        }

        const hashPassword = bcrypt.hashSync(password, 12);

        const user = new User({
            password: hashPassword,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            isAdmin: false,
            isCounselor: false,
            avatar: 'https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png',
            cart: {
                items: [],
                totalQuantity: 0,
            },
            isDisable: false,
        })
        const result = await user.save();
        if (result) {
            return res.sendStatus(200);
        }
        return res.status(400).send(JSON.stringify({
            message: "Sorry system is Error!",
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

exports.isAccessToken = async (req, res) => {
    try {
        const token = req.session.token;
        if (!token) {
            return res.status(401).send(JSON.stringify({
                message: 'UnAuthorization'
            }));
        }
        const decoded = jwt.verify(token, getKeyEnvironmentVariable('SECRET_KEY'));
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

exports.logout = async (req, res) => {
    try {
        req.session.destroy((error) => {
            console.log(error)
        })
        return res.status(200).send(JSON.stringify({
            success: true
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