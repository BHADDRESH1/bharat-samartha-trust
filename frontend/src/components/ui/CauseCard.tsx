'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';

interface CauseProps {
  id: number;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  donors: number;
}

interface CauseCardProps {
  cause: CauseProps;
  delay?: number;
}

export default function CauseCard({ cause, delay = 0 }: CauseCardProps) {
  const raised = cause.raised || 0;
  const goal = cause.goal || 1;
  const donors = cause.donors || 0;
  const progress = (raised / goal) * 100;
  
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
        {/* FIXED: Actually use the image URL */}
        <Image
          src={cause.image}
          alt={cause.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <h3 className="text-xl font-bold text-white">{cause.title}</h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-gray-600 mb-4">{cause.description}</p>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">₹{raised.toLocaleString('en-IN')} raised</span>
            <span className="text-gray-500">Goal: ₹{goal.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(progress, 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: delay + 0.3 }}
            />
          </div>
        </div>
        
        {/* Donors */}
        <div className="flex items-center mb-4 text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          <span>{donors} donors</span>
        </div>
        
        {/* Button */}
        <Link 
          href="/donate"
          className="block w-full py-3 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
        >
          Donate Now
        </Link>
      </div>
    </motion.div>
  );
}