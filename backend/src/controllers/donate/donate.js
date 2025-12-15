import Donation from '../models/Donation';
import { Request, Response } from 'express';

// Save donation (called when user completes donation)
export const saveDonation = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      isMonthly,
      donor,
      paymentMethod
    } = req.body;

    const donation = new Donation({
      amount,
      isMonthly,
      donor,
      paymentMethod,
      status: 'success' // Change to 'pending' if using real gateway
    });

    await donation.save();
    res.status(201).json({ success: true, donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error while saving donation.' });
  }
};

// Get all donations (admin route)
export const getAllDonations = async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, donations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching donations.' });
  }
};
