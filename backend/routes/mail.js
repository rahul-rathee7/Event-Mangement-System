import express from 'express';
import { userNotification } from '../controllers/userNotification.js';

const router = express.Router();

router.post('/', userNotification);

export default router;