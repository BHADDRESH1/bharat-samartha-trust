 import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { safeFetch } from '@/lib/fetchUtils';

export default function CallToAction() {
  const [ctaData, setCTAData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchCTAData();
  }, []);

  const fetchCTAData = async () => {
    try {
      const result = await safeFetch('/api/aboutcta', { timeout: 5000 });

      if (result.success && result.data) {
        setCTAData(result.data);
      } else {
        // Use fallback data
        setCTAData(getFallbackData());
      }
    } catch (err) {
      console.error('Error fetching CTA data:', err);
      // Use fallback data on error
      setCTAData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  // Fallback data for Bharat Samarth Trust
  const getFallbackData = () => ({
    mainTitle: "Join Us in Writing the Next Chapter of Hope!",
    description:
      "Together, we can transform lives across Tamil Nadu. Your support makes a real difference in our communities.",
    backgroundType: "gradient",
    gradientFrom: "purple-600",
    gradientTo: "blue-500",
    textColor: "white",
    padding: "large",
    buttons: [
      {
        id: "donate",
        text: "Donate Now",
        href: "/donate",
        style: "primary",
        visible: true,
        order: 1,
      },
      {
        id: "volunteer",
        text: "Become a Volunteer",
        href: "/get-involved",
        style: "secondary",
        visible: true,
        order: 2,
      },
    ],
    animation: {
      enabled: true,
      titleDelay: 0,
      descriptionDelay: 0.2,
      buttonsDelay: 0.4,
      duration: 0.6,
    },
  });

  if (loading) {
    return (
      <section className="py-20 bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </section>
    );
  }

  if (!ctaData) {
    return (
      <section className="py-20 bg-red-100 text-red-800 text-center">
        <p>Error loading CTA section: {error}</p>
      </section>
    );
  }

  // Background class generator
  const getBackgroundClass = () => {
    switch (ctaData.backgroundType) {
      case "gradient":
        return `bg-gradient-to-r from-${ctaData.gradientFrom} to-${ctaData.gradientTo}`;
      case "solid":
        return `bg-${ctaData.solidColor}`;
      case "image":
        return `bg-cover bg-center bg-no-repeat`;
      default:
        return "bg-gradient-to-r from-purple-600 to-blue-500";
    }
  };

  // Padding class generator
  const getPaddingClass = () => {
    switch (ctaData.padding) {
      case "small":
        return "py-12";
      case "medium":
        return "py-16";
      case "large":
        return "py-20";
      default:
        return "py-20";
    }
  };

  // Sort visible buttons
  const sortedButtons =
    ctaData.buttons
      ?.filter((button: any) => button.visible)
      ?.sort((a: any, b: any) => a.order - b.order) || [];

  // Button style generator
  const getButtonClass = (style: string) => {
    if (style === "primary") {
      return "px-8 py-4 bg-white text-purple-600 font-bold rounded-full text-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg";
    } else {
      return "px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-xl hover:bg-white/10 transition-all duration-300";
    }
  };

  return (
    <section
      className={`${getPaddingClass()} ${getBackgroundClass()} text-${ctaData.textColor}`}
      style={
        ctaData.backgroundType === "image"
          ? { backgroundImage: `url(${ctaData.backgroundImage})` }
          : {}
      }
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {ctaData.animation?.enabled ? (
            <>
              <motion.h2
                className="text-3xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: ctaData.animation.duration || 0.6,
                  delay: ctaData.animation.titleDelay || 0,
                }}
              >
                {ctaData.mainTitle}
              </motion.h2>

              <motion.p
                className="text-xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: ctaData.animation.duration || 0.6,
                  delay: ctaData.animation.descriptionDelay || 0.2,
                }}
              >
                {ctaData.description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: ctaData.animation.duration || 0.6,
                  delay: ctaData.animation.buttonsDelay || 0.4,
                }}
              >
                {sortedButtons.map((button: any) => (
                  <a
                    key={button.id}
                    href={button.href}
                    className={getButtonClass(button.style)}
                  >
                    {button.text}
                  </a>
                ))}
              </motion.div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {ctaData.mainTitle}
              </h2>

              <p className="text-xl mb-8">{ctaData.description}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {sortedButtons.map((button: any) => (
                  <a
                    key={button.id}
                    href={button.href}
                    className={getButtonClass(button.style)}
                  >
                    {button.text}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
