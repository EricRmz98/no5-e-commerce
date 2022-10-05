const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

// decrypt the token to get the user id, if user exists grant access
const protectSession = catchAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('The token was invalid', 403));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
        where: { id: decoded.id, status: 'active' },
        attributes: { exclude: 'password' },
    });

    if (!user) {
        return next(
            new AppError('The owner of the session is no longer active', 403)
        );
    }

    req.sessionUser = user;
    next();
});

// check if the user in session is the same as the get by params
const protectUsersAccount = (req, res, next) => {
    const { sessionUser, user } = req;

    if (sessionUser.id !== user.id) {
        return next(
            new AppError('you are not the owner of this account.', 403)
        );
    }

    next();
};

// check if the user in session is the owner of the product
const protectUsersProduct = (req, res, next) => {
    const { sessionUser, product } = req;

    if (sessionUser.id !== product.userId) {
        return next(new AppError('you are not the owner of this product', 403));
    }

    next();
};

module.exports = {
    protectSession,
    protectUsersAccount,
    protectUsersProduct,
};
