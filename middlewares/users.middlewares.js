// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

// get a user, if doesn't exist send an error
const userExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findOne({
        attributes: { exclude: ['password'] },
        where: { id },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    req.user = user;
    next();
});

module.exports = {
    userExists,
};
