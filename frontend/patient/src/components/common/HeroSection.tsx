import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  subtitle, 
  imageSrc, 
  className = "" 
}) => {
  return (
    <section className={`relative overflow-hidden py-24 md:py-32 ${className}`}>
      {/* Soft Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50"></div>
      
      {/* Optional Overlay Graphics for Visual Depth */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-indigo-200/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-20 right-20 w-24 h-24 bg-purple-200/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-20 left-1/4 w-20 h-20 bg-blue-200/10 rounded-full blur-lg"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            x: [0, -10, 0]
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-32 right-1/3 w-16 h-16 bg-indigo-300/8 rounded-full blur-md"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            {/* Title */}
            <Title 
              level={1} 
              className="!text-4xl md:!text-5xl lg:!text-6xl font-bold !mb-6 text-gray-900 leading-tight"
            >
              {title}
            </Title>
            
            {/* Subtitle */}
            {subtitle && (
              <Paragraph className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                {subtitle}
              </Paragraph>
            )}
          </motion.div>

          {/* Optional Illustration */}
          {imageSrc && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="mt-8"
            >
              <div className="relative">
                <img 
                  src={imageSrc} 
                  alt={title}
                  className="w-full max-w-md mx-auto opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-2xl -z-10 scale-110"></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
