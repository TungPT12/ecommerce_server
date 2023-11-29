const User = require("../../../models/User");
const bcrypt = require('bcryptjs')

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
                items: []
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