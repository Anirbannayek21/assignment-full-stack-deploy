const { check, validationResult } = require("express-validator")

exports.validateSignupRequest = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('password').notEmpty().withMessage('password is required'),
    check('email').isEmail().withMessage('Valid Email is required'),
    check('password').isLength({ min: 6 })
        .withMessage('Password shold be at least 6 character long')
];

exports.validateSigninRequest = [
    check('email').isEmail().withMessage('Valid Email is required'),
    check('password').isLength({ min: 6 })
        .withMessage('Password shold be at least 6 character long')
];

exports.validateLogs = [
    check('phone').notEmpty().withMessage('phone is required'),
    check('phone').isLength({ min: 10 }).withMessage('phone number must be 10 charater'),
    check('text').notEmpty().withMessage('text is required'),
    check('text').isLength({ max: 160 })
        .withMessage('text should be at less then 160 character long')
];

exports.isRequestValid = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(400).json({
            message: errors.array()[0].msg
        })
    }
    next();
}

