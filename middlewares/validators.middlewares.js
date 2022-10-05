const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError.util');

const checkValidations = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);

        const message = errorMessages.join('. ');

        return next(new AppError(message, 400));
    }

    next();
};

const validateRoleField = (req, res, next) => {
    const { role } = req.body;

    if (role && role !== 'admin' && role !== 'normal') {
        return next(new AppError('invalid role', 400));
    }

    if (role === '') {
        return next(new AppError('role field can not be empty', 400));
    }

    next();
};

const createUserValidators = [
    body('username')
        .exists()
        .withMessage('username field missing in request')
        .isString()
        .withMessage('username must be a string')
        .notEmpty()
        .withMessage('username cannot be empty')
        .isLength({ min: 3 })
        .withMessage('username must be at least 3 characters'),
    body('email')
        .exists()
        .withMessage('email field missing in request')
        .isEmail()
        .withMessage('email is not valid'),
    body('password')
        .exists()
        .withMessage('password field missing in request')
        .isString()
        .withMessage('password must be a string')
        .notEmpty()
        .withMessage('password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters'),
    checkValidations,
];

const updateUserValidators = [
    body('username')
        .exists()
        .withMessage('username field missing in request')
        .isString()
        .withMessage('username must be a string')
        .notEmpty()
        .withMessage('username cannot be empty')
        .isLength({ min: 3 })
        .withMessage('username must be at least 3 characters'),
    body('email')
        .exists()
        .withMessage('email field missing in request')
        .isEmail()
        .withMessage('email is not valid'),
    checkValidations,
];

const loginValidators = [
    body('email')
        .exists()
        .withMessage('email field missing in request')
        .isEmail()
        .withMessage('email is not valid'),
    body('password')
        .exists()
        .withMessage('password field missing in request')
        .isString()
        .withMessage('password must be a string')
        .notEmpty()
        .withMessage('password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters'),
    checkValidations,
];

const createProductValidators = [
    body('title')
        .exists()
        .withMessage('title field missing in request')
        .isString()
        .withMessage('title must be a string')
        .notEmpty()
        .withMessage('title cannot be empty')
        .isLength({ min: 10 })
        .withMessage('title must be at least 10 characters'),
    body('description')
        .exists()
        .withMessage('description field missing in request')
        .isString()
        .withMessage('description must be a string')
        .notEmpty()
        .withMessage('description cannot be empty')
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters'),
    body('quantity')
        .exists()
        .withMessage('quantity field missing in request')
        .isInt({ min: 1 })
        .withMessage('quantity must be a integer greater than 0'),
    body('price')
        .exists()
        .withMessage('price field missing in request')
        .isInt({ min: 1 })
        .withMessage('price must be a integer greater than 0'),
    body('categoryId')
        .exists()
        .withMessage('categoryId field missing in request')
        .isInt()
        .withMessage('categoryId must be a integer'),
    checkValidations,
];

const updateProductValidator = [
    body('title')
        .exists()
        .withMessage('title field missing in request')
        .isString()
        .withMessage('title must be a string')
        .notEmpty()
        .withMessage('title cannot be empty')
        .isLength({ min: 10 })
        .withMessage('title must be at least 10 characters'),
    body('description')
        .exists()
        .withMessage('description field missing in request')
        .isString()
        .withMessage('description must be a string')
        .notEmpty()
        .withMessage('description cannot be empty')
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters'),
    body('quantity')
        .exists()
        .withMessage('quantity field missing in request')
        .isInt({ min: 1 })
        .withMessage('quantity must be a integer greater than 0'),
    body('price')
        .exists()
        .withMessage('price field missing in request')
        .isInt({ min: 1 })
        .withMessage('price must be a integer greater than 0'),
    checkValidations,
];

const createUpdateCategoryValidators = [
    body('name')
        .exists()
        .withMessage('name field missing in request')
        .isString()
        .withMessage('name must be a string')
        .notEmpty()
        .withMessage('name cannot be empty')
        .isLength({ min: 4 })
        .withMessage('name must be at least 4 characters'),
    checkValidations,
];

const addProductToCartValidators = [
    body('productId')
        .exists()
        .withMessage('productId field missing in request')
        .isInt()
        .withMessage('productId must be a integer'),
    body('quantity')
        .exists()
        .withMessage('quantity field missing in request')
        .isInt({ min: 1 })
        .withMessage('quantity must be a integer greater than 0'),
    checkValidations,
];

const updateProductInCartValidators = [
    body('productId')
        .exists()
        .withMessage('productId field missing in request')
        .isInt()
        .withMessage('productId must be a integer'),
    body('newQty')
        .exists()
        .withMessage('newQty field missing in request')
        .isInt({ min: -1 })
        .withMessage('newQty must be a integer greater or equal to 0'),
    checkValidations,
];

module.exports = {
    createUserValidators,
    updateUserValidators,
    validateRoleField,
    loginValidators,
    createUpdateCategoryValidators,
    createProductValidators,
    updateProductValidator,
    addProductToCartValidators,
    updateProductInCartValidators,
};
