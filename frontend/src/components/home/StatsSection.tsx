'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { safeFetch } from '@/lib/fetchUtils';
import DataLoader from '@/components/ui/DataLoader';

interface StatItem {
  id: string;
  value: number;
  label: string;
  icon: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const StatsSection = React.forwardRef<HTMLDivElement>((props, ref) => {
  // Fetch stats data
  const fetchStatsData = async () => {
    try {
      const result = await safeFetch('/api/stat/stats', {
        timeout: 10000,
        retries: 2,
        cacheKey: 'stats-data', // Add caching
        ttl: 300000 // Cache for 5 minutes
      });
      
      if (result.success && result.data) {
        return Array.isArray(result.data) ? result.data : [result.data];
      }
      
      // Return fallback data if API fails
      return getFallbackData();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return getFallbackData();
    }
  };

  // Fallback data
  const getFallbackData = (): StatItem[] => [
    {
      id: '1',
      value: 5000,
      label: 'People Helped',
      icon: '👥',
      suffix: '+'
    },
    {
      id: '2',
      value: 150,
      label: 'Active Volunteers',
      icon: '🤝',
      suffix: '+'
    },
    {
      id: '3',
      value: 25,
      label: 'Successful Projects',
      icon: '🏆',
      suffix: '+'
    },
    {
      id: '4',
      value: 10,
      label: 'Years of Service',
      icon: '📅'
    }
  ];

  return (
    <DataLoader
      fetchData={fetchStatsData}
      fallbackData={getFallbackData()}
    >
      {(data) => (
        <section 
          ref={ref}
          className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {data.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  className="stat-item text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                      decimals={stat.decimals || 0}
                    />
                  </div>
                  <div className="text-sm md:text-base opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </DataLoader>
  );
});

StatsSection.displayName = 'StatsSection';

export default StatsSection;