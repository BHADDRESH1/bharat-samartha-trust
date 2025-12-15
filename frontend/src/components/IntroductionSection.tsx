'use client';

import { motion } from 'framer-motion';
import { Heart, ArrowRight, Star, Users, Globe } from 'lucide-react';

const IntroductionSection = () => {
  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  const titleWords = "Our Causes – Together, We Create Change".split(" ");
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-5">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-500"></div>
        <div className="absolute top-1/4 right-0 w-60 h-60 rounded-full bg-blue-500"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-green-500"></div>
      </div>
      
      {/* Floating Icons */}
      {[Heart, Star, Users, Globe].map((Icon, i) => (
        <motion.div 
          key={`icon-${i}`}
          className="absolute hidden md:block text-purple-500 opacity-20"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            fontSize: `${30 + Math.random() * 20}px`
          }}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={iconVariants}
        >
          <Icon size={24 + i * 8} />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={textVariants}
        >
          {/* Animated Title */}
          <motion.div 
            className="flex flex-wrap justify-center gap-x-3 mb-8"
            variants={textVariants}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={`word-${i}`}
                className="inline-block text-3xl md:text-5xl font-bold"
                custom={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: (i) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.1,
                      duration: 0.5
                    }
                  })
                }}
              >
                <span className={`${i % 2 === 0 ? 'text-gray-800' : 'text-purple-600'}`}>{word}</span>
              </motion.span>
            ))}
          </motion.div>

          {/* Quote with highlight effect */}
          <motion.div
            className="relative mb-8 py-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="absolute inset-0 bg-purple-50 rounded-lg"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
            />
            <motion.p 
              className="text-lg md:text-xl text-gray-700 italic relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              viewport={{ once: true }}
            >
              "A single act of kindness can spark a <span className="text-purple-600 font-semibold">lifetime of hope</span>."
            </motion.p>
          </motion.div>

          {/* Main text with animated reveal */}
          <motion.p 
            className="text-lg text-gray-700 mb-8 leading-relaxed"
            variants={textVariants}
          >
            At our charity, we work tirelessly to solve real problems, uplift communities, and transform lives.
            Our causes range from feeding the hungry and educating children to healthcare access and women empowerment.
          </motion.p>

          {/* Stats counter */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
          >
            {[
              { label: "Lives Changed", value: "50K+", color: "purple" },
              { label: "Communities Served", value: "120+", color: "blue" },
              { label: "Projects Completed", value: "350+", color: "green" },
              { label: "Volunteers", value: "1,000+", color: "pink" }
            ].map((stat, i) => (
              <motion.div
                key={`stat-${i}`}
                className="p-4 rounded-lg bg-white shadow-md"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <p className={`text-2xl md:text-3xl font-bold mb-1 text-${stat.color}-600`}>{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Final call to action */}
          <motion.div 
            className="flex flex-wrap gap-6 justify-center items-center p-6 bg-white rounded-xl shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <p className="text-xl font-semibold text-purple-600 flex items-center">
              Every donation, every volunteer, and every effort counts.
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Heart className="ml-2" size={20} />
              </motion.span>
            </p>
            <p className="text-lg text-gray-700">Together, we can rewrite the future for those in need.</p>
            
            <motion.button
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full flex items-center font-medium"
              whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
              whileTap={{ scale: 0.95 }}
            >
              Join Our Cause
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="ml-2" size={18} />
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroductionSection;