const { check } = require('express-validator');

exports.validatePost = () => {
    return [
        check('name', 'title have max 3 character!').isLength({ min: 3 })
            .trim().not().isEmpty(),
        check('image', 'Invalid image').not().isEmpty(),
        // check('content', 'description  max 5 character!').isLength({ min: 3 }),
    ];
}
