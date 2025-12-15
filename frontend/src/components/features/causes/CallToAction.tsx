'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <section className="py-16 bg-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            Join Us in Making a Difference
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Your contribution can change lives. Every donation, no matter the size, 
            brings us one step closer to creating a better world for everyone.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/donate">
              <div className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                Donate Now
              </div>
            </Link>
            
            <Link href="/volunteer">
              <div className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                Volunteer With Us
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;