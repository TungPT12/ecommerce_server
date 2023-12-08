const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const getKeyEnvironmentVariable = require('../../utils/getKeyEnvironmentVariable');

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
        let user = await User.findOne({ _id: userId }).select('-cart -password')
        if (user.isAdmin) {
            return res.send(JSON.stringify({
                ...user._doc,
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

exports.signin = async (req, res) => {
    try {
        console.log("asd")
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
            const token = jwt.sign({
                _id: user._id,
                isAdmin: user.isAdmin
            }, getKeyEnvironmentVariable('SECRET_KEY'), { expiresIn: '1d' });

            req.session.token = token;
            req.session.isAuthn = true;
            return res.send(JSON.stringify({
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
                isisCounselor: user.isCounselor,
                phoneNumber: user.phoneNumber,
                token: token
            }));
        }
        return res.status(403).send(JSON.stringify({
            message: "Not permission!",
            success: false
        }))

    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

// exports.logout = async (req, res) => {
//     try {
//         req.session.destroy((error) => {
//             console.log(error)
//         })
//         return res.status(200).send(JSON.stringify({
//             success: true
//         }))
//     } catch (error) {
//         req.session.destroy((error) => {
//             console.log(error)
//         })
//         return res.status(403).send(JSON.stringify({
//             message: 'UnAuthorization'
//         }));
//     }
// }