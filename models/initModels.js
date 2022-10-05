// Models
const { User } = require('./user.model');
const { Product } = require('./product.model');
const { Order } = require('./order.model');
const { Cart } = require('./cart.model');
const { Category } = require('./category.model');
const { ProductImg } = require('./productImg.model');
const { ProductInCart } = require('./productInCart.model');

const initModels = () => {
    // 1 user <---> M products
    User.hasMany(Product, { foreignKey: 'userId' });
    Product.belongsTo(User);

    // 1 user <---> M orders
    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User);

    // 1 user <---> 1 cart
    User.hasOne(Cart, { foreignKey: 'userId' });
    Cart.belongsTo(User);

    // 1 category <---> 1 product
    Category.hasOne(Product, { foreignKey: 'categoryId' });
    Product.belongsTo(Category);

    // 1 product <---> M productImgs
    Product.hasMany(ProductImg, { foreignKey: 'productId' });
    ProductImg.belongsTo(Product);

    // 1 product <---> 1 productInCart
    Product.hasOne(ProductInCart, { foreignKey: 'productId' });
    ProductInCart.belongsTo(Product);

    // 1 cart <---> M productsInCart
    Cart.hasMany(ProductInCart, { foreignKey: 'cartId' });
    ProductInCart.belongsTo(Cart);

    // 1 cart <---> 1 order
    Cart.hasOne(Order, { foreignKey: 'cartId' });
    Order.belongsTo(Cart);
};

module.exports = { initModels };
