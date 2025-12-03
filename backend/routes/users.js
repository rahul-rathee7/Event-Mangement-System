import express from 'express'
import { users_data, update_user_data, user_location, getUserByName, registered_events } from '../controllers/userData.js'
import { store_message, two_factor } from '../controllers/userNotification.js';

const router = express.Router()

router.post('/', users_data);
router.post('/update-data', update_user_data);
router.post('/store-message', store_message);
router.get('/search-location', user_location);
router.post('/enable-two-factor', two_factor);
router.post('/getUserByName', getUserByName);
router.post('/registered-events', registered_events);

export default router;