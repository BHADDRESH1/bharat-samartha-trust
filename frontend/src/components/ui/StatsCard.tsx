'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  iconColor: string;
  delay?: number;
}

export default function StatsCard({ icon: Icon, value, label, iconColor, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gray-50 rounded-full">
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
      
      <motion.div 
        className="text-3xl font-bold text-gray-800 mb-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {value}
      </motion.div>
      
      <div className="text-gray-600 font-medium">{label}</div>
    </motion.div>
  );
}