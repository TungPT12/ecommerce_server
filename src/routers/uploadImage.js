const multer = require('multer');
const express = require('express');
const router = express.Router();
const uploadImageController = require('../controllers/uploadImage');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

router.post('/upload-images', upload.array('images'), uploadImageController.uploadImages)
router.post('/upload-image', upload.single('image'), uploadImageController.uploadImage)

module.exports = router;