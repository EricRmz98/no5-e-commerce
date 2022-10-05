// models
const { ProductInCart } = require('../models/productInCart.model');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');

// utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

// get active products in cart
const getCartProducts = catchAsync(async (req, res, next) => {
    const cartId = req.cart.id;

    const productsInCart = await ProductInCart.findAll({
        where: { cartId, status: 'active' },
        include: { model: Product },
    });

    res.status(200).json({
        status: 'success',
        data: { productsInCart },
    });
});

// add a product to user's cart or update a removed product
const addProductToCart = catchAsync(async (req, res, next) => {
    const cartId = req.cart.id;
    const { productId, quantity } = req.body;

    const productInCart = await ProductInCart.findOne({
        where: { cartId, productId },
    });

    if (!productInCart) {
        const newProductInCart = await ProductInCart.create({
            cartId,
            productId,
            quantity,
        });

        return res.status(201).json({
            status: 'success',
            data: { productInCart: newProductInCart },
        });
    }

    if (productInCart.status === 'active') {
        return next(new AppError('this product is already in the cart', 400));
    }

    if (productInCart.status === 'removed') {
        await productInCart.update({ status: 'active', quantity });

        return res.status(200).json({
            status: 'success',
            data: { productInCart },
        });
    }
});

// update the quantity of a product in cart or remove it
const updateProductInCart = catchAsync(async (req, res, next) => {
    const { productInCart } = req;
    const quantity = req.body.newQty;

    if (quantity === 0) {
        await productInCart.update({ quantity, status: 'removed' });
    } else {
        await productInCart.update({ quantity });
    }

    res.status(200).json({
        status: 'success',
        data: { productInCart },
    });
});

// remove a product from cart
const removeProduct = catchAsync(async (req, res, next) => {
    const { productInCart } = req;

    await productInCart.update({ status: 'removed', quantity: 0 });

    res.status(204).json({
        status: 'success',
    });
});

// create an order and set the cart and products in cart as purchased
const purchaseCart = catchAsync(async (req, res, next) => {
    const { productsInCart } = req;
    const { cart } = req;
    const userId = req.sessionUser.id;
    const totalPrice = req.total;

    const purchaseProductsPromises = productsInCart.map(
        async (productInCart) => {
            const quantity =
                productInCart.product.quantity - productInCart.quantity;

            await productInCart.product.update({ quantity });
            await productInCart.update({ status: 'purchased' });
        }
    );

    await Promise.all(purchaseProductsPromises);

    await cart.update({ status: 'purchased' });

    const newOrder = await Order.create({
        userId,
        cartId: cart.id,
        totalPrice,
    });

    res.status(201).json({
        status: 'success',
        data: { order: newOrder },
    });
});

module.exports = {
    addProductToCart,
    updateProductInCart,
    removeProduct,
    purchaseCart,
    getCartProducts,
};
