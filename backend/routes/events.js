import express from 'express';
import { event_data, featured_events, all_events } from '../controllers/eventData.js';

const router = express.Router();

router.post('/', event_data);
router.get('/featured-events', featured_events);
router.get('/get-all', all_events);


export default router;