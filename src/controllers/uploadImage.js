exports.uploadImage = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.json([])
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