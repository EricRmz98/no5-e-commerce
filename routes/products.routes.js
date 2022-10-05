const express = require('express');

// controllers
const {
    createCategory,
    getCategories,
    updateCategory,
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../controllers/products.controller');

// middlewares
const {
    protectSession,
    protectUsersProduct,
} = require('../middlewares/auth.middlewares');
const {
    categoryExists,
    productExists,
} = require('../middlewares/products.middlewares');
const {
    createUpdateCategoryValidators,
    createProductValidators,
    updateProductValidator,
} = require('../middlewares/validators.middlewares');

//utils
const { upload } = require('../utils/multer.util');

const productsRouter = express.Router();

// create product
productsRouter.post(
    '/',
    upload.array('productImg', 5),
    createProductValidators,
    protectSession,
    createProduct
);

// get all products
productsRouter.get('/', getProducts);

// update product
productsRouter.patch(
    '/:id',
    updateProductValidator,
    protectSession,
    productExists,
    protectUsersProduct,
    updateProduct
);

// delete product
productsRouter.delete(
    '/:id',
    protectSession,
    productExists,
    protectUsersProduct,
    deleteProduct
);

// get all categories
productsRouter.get('/categories', getCategories);

// get product by id
productsRouter.get('/:id', getProductById);

// create category
productsRouter.post(
    '/categories',
    createUpdateCategoryValidators,
    protectSession,
    createCategory
);

// update category
productsRouter.patch(
    '/categories/:id',
    createUpdateCategoryValidators,
    protectSession,
    categoryExists,
    updateCategory
);

module.exports = { productsRouter };
