const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

// create a new user with his encrypted password
const createUser = catchAsync(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
    });

    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        data: { newUser },
    });
});

// update the user info
const updateUser = catchAsync(async (req, res, next) => {
    const { username, email } = req.body;
    const { user } = req;

    await user.update({ username, email });

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

// delete an active user
const deleteUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    await user.update({ status: 'deleted' });

    res.status(204).json({ status: 'success' });
});

// let the user login to return a token
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email, status: 'active' },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Wrong credentials', 400));
    }

    user.password = undefined;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(200).json({
        status: 'success',
        data: { user, token },
    });
});

// get all products created by the user
const getUsersProducts = catchAsync(async (req, res, next) => {
    const userId = req.sessionUser.id;

    const products = await Product.findAll({
        where: { status: 'active', userId },
    });

    res.status(200).json({
        status: 'success',
        data: { products },
    });
});

// get all orders purchased by the user
const getUserOrders = catchAsync(async (req, res, next) => {
    const userId = req.sessionUser.id;

    const orders = await Order.findAll({
        where: { userId, status: 'active' },
        include: {
            model: Cart,
            include: {
                model: ProductInCart,
                where: { status: 'purchased' },
                include: { model: Product },
            },
        },
    });

    res.status(200).json({
        status: 'success',
        data: { orders },
    });
});

// get an order purchased by the user
const getUserOrder = catchAsync(async (req, res, next) => {
    const userId = req.sessionUser.id;
    const { id } = req.params;

    const order = await Order.findOne({
        where: { id, userId, status: 'active' },
        include: {
            model: Cart,
            include: {
                model: ProductInCart,
                where: { status: 'purchased' },
                include: { model: Product },
            },
        },
    });

    if (!order) {
        return next(new AppError('order not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { order },
    });
});

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    login,
    getUsersProducts,
    getUserOrders,
    getUserOrder,
};
