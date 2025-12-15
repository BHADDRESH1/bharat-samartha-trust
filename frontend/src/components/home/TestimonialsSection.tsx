import React from 'react';
import { motion } from 'framer-motion';
import TestimonialSlider from '@/components/features/TestimonialSlider';

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Voices of Change</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from the people whose lives have been transformed through our programs.
          </p>
        </motion.div>
        
        <TestimonialSlider />
      </div>
    </section>
  );
};

export default TestimonialsSection;