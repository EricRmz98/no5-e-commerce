// models
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model');
const { ProductImg } = require('../models/productImg.model');
const { AppError } = require('../utils/appError.util');

// utils
const { catchAsync } = require('../utils/catchAsync.util');
const {
    uploadProductImgs,
    getProductsImgsUrls,
} = require('../utils/firebase.util');

// create a new product with its images
const createProduct = catchAsync(async (req, res, next) => {
    const { title, description, quantity, price, categoryId } = req.body;
    const userId = req.sessionUser.id;

    if (req.files.length === 0) {
        return next(new AppError('must provide 1 to 5 product images', 400));
    }

    const newProduct = await Product.create({
        title,
        description,
        quantity,
        price,
        categoryId,
        userId,
    });

    await uploadProductImgs(req.files, newProduct.id);

    res.status(201).json({
        status: 'success',
        data: { product: newProduct },
    });
});

// get all active products with their images urls
const getProducts = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({
        where: { status: 'active' },
        include: { model: ProductImg },
    });

    const productsWithImgs = await getProductsImgsUrls(products);

    res.status(200).json({
        status: 'success',
        data: { products: productsWithImgs },
    });
});

// get an active product with its images urls
const getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findOne({
        where: { id, status: 'active' },
        include: { model: ProductImg },
    });

    if (!product) {
        return next(new AppError('product not found', 404));
    }

    const productWithImgs = await getProductsImgsUrls([product]);

    res.status(200).json({
        status: 'success',
        data: { product: productWithImgs },
    });
});

// update the product fields
const updateProduct = catchAsync(async (req, res, next) => {
    const { product } = req;
    const { title, description, price, quantity } = req.body;

    await product.update({ title, description, price, quantity });

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

// delete an active product
const deleteProduct = catchAsync(async (req, res, next) => {
    const { product } = req;

    await product.update({ status: 'deleted' });

    res.status(204).json({
        status: 'success',
    });
});

// get all active categories
const getCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.findAll({ where: { status: 'active' } });

    res.status(200).json({
        status: 'success',
        data: { categories },
    });
});

// create a new category
const createCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    const newCategory = await Category.create({ name });

    res.status(201).json({
        status: 'success',
        data: { Category: newCategory },
    });
});

// update a category name
const updateCategory = catchAsync(async (req, res, next) => {
    const { category } = req;
    const { name } = req.body;

    await category.update({ name });

    res.status(200).json({
        status: 'success',
        data: { category },
    });
});

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
