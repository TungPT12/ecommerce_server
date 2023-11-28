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
    console.log(file);
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

router.post('/upload', upload.array('images'), uploadImageController.uploadImage)

module.exports = router;