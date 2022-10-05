// models
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model');
const { AppError } = require('../utils/appError.util');

// utils
const { catchAsync } = require('../utils/catchAsync.util');

// get a category, if doesn't exists send an error
const categoryExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const category = await Category.findOne({ where: { id } });

    if (!category) {
        return next(new AppError('category not found', 404));
    }

    req.category = category;
    next();
});

// get a product, if doesn't exists send an error
const productExists = catchAsync(async (req, res, next) => {
    const id = req.params.id || req.body.productId;

    const product = await Product.findOne({ where: { id, status: 'active' } });

    if (!product) {
        return next(new AppError('product not found', 404));
    }

    req.product = product;
    next();
});

module.exports = { categoryExists, productExists };
