const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/createUser', userController.createUser);

router.post('/updateUser', userController.updateUser);

router.post('/sendReset', userController.sendReset);

router.post('/resetPassword', userController.resetPassword);

router.post('/findUser', userController.findUserById);

router.post('/deleteUser', userController.deleteUser);

router.post('/getUserNames', userController.getUserNames);

module.exports = router;