const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/create', userController.createUser);

router.post('/update', userController.updateUser);

router.post('/sendReset', userController.sendReset);

router.post('/resetPassword', userController.resetPassword);

router.post('/findUser', userController.findUserById);

router.post('/delete', userController.deleteUser);

router.post('/getNames', userController.getUserNames);

module.exports = router;