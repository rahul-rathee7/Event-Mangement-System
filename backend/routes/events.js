import express from 'express';
import { upload } from '../middleware/multer.js'
import { event_data, create_event, featured_events, all_events, registered_users } from '../controllers/eventData.js';

const router = express.Router();

router.get('/event/:id', event_data);
router.get('/featured-events', featured_events);
router.get('/get-all', all_events);
router.post('/create-event', upload.single("image"), create_event);
router.get('/registered-users/:id', registered_users);


export default router;