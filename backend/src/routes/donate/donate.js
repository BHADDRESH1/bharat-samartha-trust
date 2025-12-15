import express from 'express';
import { saveDonation, getAllDonations } from '../controllers/donationController';

const router = express.Router();

// POST /api/donations
router.post('/', saveDonation);

// GET /api/donations (for admin)
router.get('/', getAllDonations);

export default router;
