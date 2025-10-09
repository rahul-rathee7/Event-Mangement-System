import express from 'express'
import { Check_Cookie, login_user, logout_user } from '../controllers/Auth.js'

const router = express.Router()

router.get('/get-cookie', Check_Cookie)
router.post('/login', login_user);
router.get('/logout', logout_user);

export default router;