const { check } = require('express-validator');

exports.validatePost = () => {
    return [
        check('name', 'title have max 3 character!').isLength({ min: 3 })
            .trim().not().isEmpty(),
        check('image', 'Invalid image').not().isEmpty(),
        // check('content', 'description  max 5 character!').isLength({ min: 3 }),
    ];
}

exports.validateProduct = () => {
    return [
        check('name', 'title have max 3 character!').isLength({ min: 3 })
            .trim().not().isEmpty(),
        check('price', 'Invalid price').isNumeric(),
        check('images', 'Invalid image').not().isEmpty(),
        check('short_desc', 'Invalid image').isLength({ min: 3 })
            .trim().not().isEmpty(), ,
        check('long_desc', 'Invalid image').isLength({ min: 3 })
            .trim().not().isEmpty(),
        check('category', 'Invalid image').not().isEmpty(),
        check('quantity', 'Invalid image').isNumeric(),
        // check('content', 'description  max 5 character!').isLength({ min: 3 }),
    ];
}
