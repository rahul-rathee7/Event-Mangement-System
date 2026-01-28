import express from 'express';
import { forget_password, userNotification, verify_otp, reset_password } from '../controllers/userNotification.js';

const router = express.Router();

router.post('/', userNotification);
router.post('/forget-password', forget_password);
router.post('/verify-otp', verify_otp);
router.post('/reset-password', reset_password);

export default router;