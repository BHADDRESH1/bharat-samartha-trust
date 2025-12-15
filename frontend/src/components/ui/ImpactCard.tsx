'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface ImpactCardProps {
  title: string;
  description: string;
  iconColor: string;
  delay?: number;
}

export default function ImpactCard({ title, description, iconColor, delay = 0 }: ImpactCardProps) {
  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className={`p-3 mb-4 inline-flex items-center justify-center rounded-full bg-gray-100`}>
        <TrendingUp className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}