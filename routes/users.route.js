const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller.js');

router.post('/userid', usersController.verifyRequest);
router.post('/login', usersController.loginRequest);
router.post('/register', usersController.registerRequest);
router.delete('/:id', usersController.deleteUserRequest);
router.put('/:id', usersController.updateUserRequest);
router.put('/pwd/:id', usersController.updatePasswordRequest);
router.get('/:id', usersController.getUserInformationRequest);

module.exports = router;