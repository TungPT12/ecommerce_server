exports.uploadImages = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.json({
                images: []
            })
        }
        const imagesLink = req.files.map((file) => {
            return `images/${file.filename}`
        })
        return res.json({
            images: imagesLink
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error!"
        })
    }
}

exports.uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.json({
                image: ""
            })
        }
        const image = `images/${req.file.filename}`
        return res.json({
            image: image
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error!"
        })
    }
}