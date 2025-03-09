import express from "express";
import authMiddleware from "../middleswares/authMiddleware.js";
import Users from "../models/userModel.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Get user profile - this specific route should come before the /:id route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Users not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, educationLevel } = req.body;
    
    // Check if user is updating their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Find user and update
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Users not found' });
    }

    // Update fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    if (user.userRole === 'STUDENT') {
      user.educationLevel = educationLevel;
    }

    // Save updated user
    await user.save();

    // Return updated user without password
    const updatedUser = await Users.findById(req.params.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Other routes
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);

export default router;
