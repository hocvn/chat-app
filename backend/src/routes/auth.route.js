import express from 'express';
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', protectRoute, updateProfile);

// check
router.get('/check', protectRoute, (req, res) => {
   try {
       res.status(200).json({ message: 'User is logged in', user: req.user });
   } catch (error) {
       console.log("Error in check route", error.message);
       res.status(500).json({ message: error.message });
   } 
});

export default router;