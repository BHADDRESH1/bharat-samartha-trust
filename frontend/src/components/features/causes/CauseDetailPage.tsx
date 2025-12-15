'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// This is the client component that handles all the interactive elements
export default function CauseDetailClient({ params }: { params: { id: string } }) {
  const [donationAmount, setDonationAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  
  const causeDetails = {
    id: params.id,
    title: 'Clean Water Initiative',
    description: 'Providing access to clean and safe drinking water in rural communities across Africa.',
    longDescription: `
      Access to clean water is a fundamental human right, yet millions of people around the world still lack this basic necessity. Our Clean Water Initiative aims to address this critical issue by implementing sustainable water solutions in rural African communities.
      
      Through this project, we install water purification systems, dig wells, and create infrastructure for water distribution. We also provide education on water conservation and hygiene practices to ensure long-term sustainability.
      
      Your donation will directly contribute to bringing clean water to families who currently walk miles each day to collect water from contaminated sources. This not only improves health outcomes but also gives back time for education and economic activities.
    `,
    image: '/images/causes/clean-water.jpg',
    gallery: [
      '/images/causes/gallery/water-1.jpg',
      '/images/causes/gallery/water-2.jpg',
      '/images/causes/gallery/water-3.jpg',
    ],
    category: 'Water',
    progress: 75,
    raised: '$15,000',
    goal: '$20,000',
    location: 'Multiple villages in Kenya and Tanzania',
    beneficiaries: '5,000+ people across 12 villages',
    startDate: 'January 2023',
    endDate: 'December 2025',
    updates: [
      {
        date: 'March 15, 2023',
        title: 'First well completed in Mbita Village',
        content: 'We are thrilled to announce the completion of our first well in Mbita Village, providing clean water to over 500 residents.'
      },
      {
        date: 'June 22, 2023',
        title: 'Water purification systems installed',
        content: 'Thanks to your generous donations, we have installed 5 water purification systems in schools across the region.'
      },
      {
        date: 'September 10, 2023',
        title: 'Community training program launched',
        content: 'Our team has started training local community members on maintenance and water conservation practices.'
      }
    ]
  };
  
  const handleDonationSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setDonationAmount(0);
  };
  
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-96 bg-blue-900">
        <div className="absolute inset-0">
          <Image 
            src={causeDetails.image} 
            alt={causeDetails.title}
            fill
            className="object-cover opacity-50"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{causeDetails.title}</h1>
            <p className="text-xl max-w-2xl mx-auto">{causeDetails.description}</p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cause Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4">About This Cause</h2>
                <div className="prose max-w-none mb-8">
                  {causeDetails.longDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-medium text-gray-600">Location</p>
                      <p className="font-bold">{causeDetails.location}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-medium text-gray-600">People Benefiting</p>
                      <p className="font-bold">{causeDetails.beneficiaries}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-medium text-gray-600">Start Date</p>
                      <p className="font-bold">{causeDetails.startDate}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-medium text-gray-600">End Date</p>
                      <p className="font-bold">{causeDetails.endDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Photo Gallery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {causeDetails.gallery.map((image, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                        <Image 
                          src={image}
                          alt={`${causeDetails.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Recent Updates</h3>
                  <div className="space-y-4">
                    {causeDetails.updates.map((update, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm text-gray-500">{update.date}</p>
                        <h4 className="font-bold text-lg">{update.title}</h4>
                        <p>{update.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right Column - Donation Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6 sticky top-24"
              >
                <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{causeDetails.raised} raised</span>
                    <span className="text-gray-500">Goal: {causeDetails.goal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${causeDetails.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Select Amount:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[20, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        className={`py-2 px-4 rounded-md ${
                          donationAmount === amount && !customAmount
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => handleDonationSelect(amount)}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="customAmount" className="block text-gray-600 mb-2">
                    Or enter custom amount:
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      id="customAmount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full py-2 pl-8 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300">
                  Donate Now
                </button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Secure payment. All donations are tax-deductible.</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center mb-4">Share this cause:</p>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-blue-600 text-white p-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                      </svg>
                    </button>
                    <button className="bg-blue-400 text-white p-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.158 1.207 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                      </svg>
                    </button>
                    <button className="bg-pink-600 text-white p-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Causes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Related Causes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* We'd map through related causes here, but adding placeholder items for now */}
            {[
              {
                title: 'Healthcare Access',
                image: '/images/causes/healthcare.jpg',
                description: 'Improving healthcare facilities in remote areas.',
                progress: 45
              },
              {
                title: 'Education for All',
                image: '/images/causes/education.jpg',
                description: 'Building schools for underprivileged children.',
                progress: 60
              },
              {
                title: 'Sustainable Farming',
                image: '/images/causes/farming.jpg',
                description: 'Teaching sustainable farming techniques.',
                progress: 85
              }
            ].map((cause, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <div className="relative h-48">
                  <Image
                    src={cause.image}
                    alt={cause.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{cause.title}</h3>
                  <p className="text-gray-600 mb-4">{cause.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${cause.progress}%` }}
                    ></div>
                  </div>
                  <Link href={`/causes/${cause.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="text-blue-600 font-medium hover:underline">
                      Learn More →
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether through donation or volunteering, your support helps us create lasting change in communities around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>
        </div>
      </section>
    </main>
  );
}