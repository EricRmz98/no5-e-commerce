// models
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');

// utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

// get the user active cart, if don't exist create a new one for the user
const getUsersCart = catchAsync(async (req, res, next) => {
    const userId = req.sessionUser.id;

    const cart = await Cart.findOne({ where: { status: 'active', userId } });

    if (cart) {
        req.cart = cart;
        return next();
    }

    const newCart = await Cart.create({ userId });

    req.cart = newCart;
    next();
});

// check if the product stock is enough to supply the requested quantity in cart
const enoughProductStock = (req, res, next) => {
    const { product } = req;
    const quantity = req.body.quantity || req.body.newQty;

    if (product.quantity === 0) {
        return next(new AppError('the product is out of stock', 400));
    }

    if (quantity > product.quantity) {
        return next(
            new AppError(
                `there is only ${product.quantity} products in stock`,
                400
            )
        );
    }

    next();
};

// get an active product in cart
const productInCartExists = catchAsync(async (req, res, next) => {
    const productId = req.body.productId || req.params.productId;
    const cartId = req.cart.id;

    const productInCart = await ProductInCart.findOne({
        where: { status: 'active', productId, cartId },
    });

    if (!productInCart) {
        return next(new AppError('product is not in the cart', 404));
    }

    req.productInCart = productInCart;
    next();
});

// get all the active products in cart
const cartActiveProducts = catchAsync(async (req, res, next) => {
    const cartId = req.cart.id;

    const productsInCart = await ProductInCart.findAll({
        where: { cartId, status: 'active' },
        include: { model: Product },
    });

    if (productsInCart.length === 0) {
        return next(new AppError('cart is empty', 400));
    }

    req.productsInCart = productsInCart;
    next();
});

// check if the products stock is enough to supply the order
const enoughOrderStock = catchAsync(async (req, res, next) => {
    const { productsInCart } = req;
    const errors = [];
    let total = 0;

    productsInCart.map((productInCart) => {
        const product = productInCart.product;

        if (productInCart.quantity > product.quantity) {
            errors.push(
                `product with id ${product.id} only have ${product.quantity} units in stock`
            );
        }

        total += product.price * productInCart.quantity;
    });

    if (errors.length !== 0) {
        return next(new AppError(errors.join(', '), 400));
    }

    req.total = total;
    next();
});

module.exports = {
    getUsersCart,
    enoughProductStock,
    productInCartExists,
    cartActiveProducts,
    enoughOrderStock,
};
