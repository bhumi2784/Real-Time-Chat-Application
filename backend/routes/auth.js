import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { register, login, getProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protectRoute, getProfile);

export default router;
