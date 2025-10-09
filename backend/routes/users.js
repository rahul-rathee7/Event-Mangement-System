import express from 'express'
import { users_data, update_user_data } from '../controllers/userData.js'

const router = express.Router()

router.post('/', users_data);
router.post('/update_data', update_user_data);

export default router;