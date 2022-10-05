const express = require('express');
const {
    addProductToCart,
    updateProductInCart,
    removeProduct,
    purchaseCart,
    getCartProducts,
} = require('../controllers/cart.controller');

// controllers

// middlewares
const { protectSession } = require('../middlewares/auth.middlewares');
const {
    getUsersCart,
    enoughProductStock,
    productInCartExists,
    cartActiveProducts,
    enoughOrderStock,
} = require('../middlewares/cart.middlewares');
const { productExists } = require('../middlewares/products.middlewares');
const {
    addProductToCartValidators,
    updateProductInCartValidators,
} = require('../middlewares/validators.middlewares');

const cartRouter = express.Router();

// get products in cart
cartRouter.get('/', protectSession, getUsersCart, getCartProducts);

// add product to cart
cartRouter.post(
    '/add-product',
    addProductToCartValidators,
    protectSession,
    productExists,
    enoughProductStock,
    getUsersCart,
    addProductToCart
);

// update product quantity in cart
cartRouter.patch(
    '/update-cart',
    updateProductInCartValidators,
    protectSession,
    productExists,
    enoughProductStock,
    getUsersCart,
    productInCartExists,
    updateProductInCart
);

// purchase cart
cartRouter.post(
    '/purchase',
    protectSession,
    getUsersCart,
    cartActiveProducts,
    enoughOrderStock,
    purchaseCart
);

// remove product from cart
cartRouter.delete(
    '/:productId',
    protectSession,
    getUsersCart,
    productInCartExists,
    removeProduct
);

module.exports = { cartRouter };
