const User = require('../../models/User');

exports.createUser = async (req, res) => {
    try {
        let { username, password, fullName, phoneNumber, email, isAdmin, avatar } = req.body;
        const user = new User({
            username: username,
            password: password,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            isAdmin: isAdmin,
            isDisable: false,
            avatar: avatar ? avatar : " 'https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
        });
        const result = await user.save();
        return res.status(200).send(JSON.stringify({
            message: "success",
            success: true
        }));
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (users.length === 0) {
            return res.send(JSON.stringify({
                results: [],
            }))
        }
        return res.send(JSON.stringify({
            results: users,
        }))
    } catch (error) {
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.disableUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (user) {
            user.isDisable = true;
            const disableUser = user.save();
            if (disableUser) {
                return res.sendStatus(200);
            }
            return res.status(400).send(JSON.stringify({
                message: "Cannot disable user",
                success: false
            }))
        }
        return res.status(404).send(JSON.stringify({
            message: "Not Found user",
            success: false
        }))
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found User",
                success: false
            }))
        }
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.enableUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const user = await User.findById(id);
            if (user) {
                user.isDisable = false;
                const disableUser = user.save();
                if (disableUser) {
                    return res.sendStatus(200);
                }
                return res.status(400).send(JSON.stringify({
                    message: "Cannot disable user",
                    success: false
                }))
            }
            return res.status(404).send(JSON.stringify({
                message: "Not Found user",
                success: false
            }))
        }
        return res.status(404).send(JSON.stringify({
            message: "Not Found id param",
            success: false
        }))
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found User",
                success: false
            }))
        }
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getNumberUsers = async (req, res) => {
    try {
        const usersCount = await User.find({
            $and: [
                { isDisable: false },
                { isAdmin: false },
                { isCounselor: false },
            ]
        }).count()
        return res.json({
            totalUser: usersCount
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}  