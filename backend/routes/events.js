import express from 'express';
import { event_data, create_event, featured_events, all_events } from '../controllers/eventData.js';

const router = express.Router();

router.get('/event/:id', event_data);
router.get('/featured-events', featured_events);
router.get('/get-all', all_events);
router.post('/create-event', create_event);


export default router;