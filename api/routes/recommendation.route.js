import express from 'express';
import { getRecommendations } from '../controller/recommendation.controller.js';

const router = express.Router();


router.get('/:userId', getRecommendations);

export default router;