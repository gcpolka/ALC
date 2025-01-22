const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const userRouter = require('express').Router();

userRouter.get('/info', authenticateToken, userController.getUserInfo)

// Route for getting all users
userRouter.get('/all', userController.getAllUsers);

// Route for searching users by role
userRouter.get('/search', userController.searchUserByRole);

// Route for getting a user by ID
userRouter.get('/info/:id', userController.getUserById);

userRouter.put("/profile", authenticateToken, userController.updateProfile)

// Route for updating a user by ID
userRouter.put('/update/:id', userController.updateUser);

// Route for deleting a user by ID
userRouter.delete('/delete/:id', userController.deleteUser);

module.exports = userRouter;