'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DonationCounterProps {
  totalAmount: number;
  donorsCount: number;
}

export default function DonationCounter({ totalAmount, donorsCount }: DonationCounterProps) {
  const [amount, setAmount] = useState(totalAmount);
  const [donors, setDonors] = useState(donorsCount);
  
  // Simulate real-time donation updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random donation between $5-50
      const donation = Math.floor(Math.random() * 46) + 5;
      setAmount(prev => prev + donation);
      setDonors(prev => prev + 1);
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-white text-center w-72 md:w-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <div className="font-semibold mb-1">Total Donations</div>
      <div className="text-2xl md:text-3xl font-bold">
        ${amount.toLocaleString()}
      </div>
      <div className="mt-1 text-sm text-white/80">from {donors.toLocaleString()} generous donors</div>
    </motion.div>
  );
}