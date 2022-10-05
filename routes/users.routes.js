const express = require('express');

// Controllers
const {
    createUser,
    updateUser,
    deleteUser,
    login,
    getUsersProducts,
    getUserOrders,
    getUserOrder,
} = require('../controllers/users.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');
const {
    protectSession,
    protectUsersAccount,
} = require('../middlewares/auth.middlewares');
const {
    createUserValidators,
    validateRoleField,
    updateUserValidators,
    loginValidators,
} = require('../middlewares/validators.middlewares');

const usersRouter = express.Router();

// create user
usersRouter.post('/', createUserValidators, validateRoleField, createUser);

// user login
usersRouter.post('/login', loginValidators, login);

// get products made by user
usersRouter.get('/me', protectSession, getUsersProducts);

// update user
usersRouter.patch(
    '/:id',
    updateUserValidators,
    protectSession,
    userExists,
    protectUsersAccount,
    updateUser
);

// delete user
usersRouter.delete(
    '/:id',
    protectSession,
    userExists,
    protectUsersAccount,
    deleteUser
);

// get all user orders
usersRouter.get('/orders', protectSession, getUserOrders);

// get user order by id
usersRouter.get('/orders/:id', protectSession, getUserOrder);

module.exports = { usersRouter };
