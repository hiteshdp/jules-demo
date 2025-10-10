import React from 'react';
import { Card, Typography, Space, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { URLS } from '../config/links';
import PublicFooter from '../components/common/PublicFooter';
import { 
  UserOutlined, 
  MedicineBoxOutlined, 
  BulbOutlined, 
  CalendarOutlined,
  HeartOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  StarOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Home: React.FC = () => {

  const features = [
    {
      icon: <BulbOutlined className="text-4xl text-blue-600" />,
      title: 'AI-Powered Diagnosis',
      description: 'Get instant, accurate hair loss assessments using advanced AI technology.'
    },
    {
      icon: <CalendarOutlined className="text-4xl text-green-600" />,
      title: 'Online Consultations',
      description: 'Connect with certified dermatologists from the comfort of your home.'
    },
    {
      icon: <HeartOutlined className="text-4xl text-red-600" />,
      title: 'Personalized Care',
      description: 'Receive customized treatment plans tailored to your specific needs.'
    },
    {
      icon: <SafetyOutlined className="text-4xl text-purple-600" />,
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security.'
    }
  ];

  const benefits = [
    'Expert dermatologist consultations',
    'AI-powered hair loss assessment',
    'Personalized treatment recommendations',
    '24/7 support and guidance',
    'Secure video consultations',
    'Progress tracking and monitoring'
  ];

  // Animation classes for CSS-based animations
  const fadeInUpClass = "animate-fade-in-up";
  const staggerClass = "animate-stagger";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
      <div className="flex-1">
        {/* Refined Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-100 via-purple-50 to-blue-100 py-20">
        {/* Subtle Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 3, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 right-10 w-20 h-20 bg-indigo-200/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-10 left-10 w-16 h-16 bg-purple-200/20 rounded-full blur-lg"
          />
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center px-6">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block bg-white/70 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-600 font-medium shadow-sm border border-white/50">
              <StarOutlined className="mr-2 text-yellow-500" />
              Trusted by 10,000+ patients worldwide
            </span>
          </motion.div>
          
          {/* Main Headlines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Your Skin. Your Confidence.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience AI-powered dermatology with expert care and personalized solutions.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8"
          >
            <a
              href={URLS.PATIENT_LOGIN}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all duration-300 flex items-center gap-2 min-w-[200px] justify-center"
            >
              <UserOutlined className="text-lg" />
              Continue as Patient
              <ArrowRightOutlined className="text-sm" />
            </a>
            
            <a
              href={URLS.DERM_LOGIN}
              className="border border-indigo-300 text-indigo-700 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center gap-2 min-w-[200px] justify-center"
            >
              <MedicineBoxOutlined className="text-lg" />
              Continue as Dermatologist
              <ArrowRightOutlined className="text-sm" />
            </a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center text-gray-500 text-sm"
          >
            <CheckCircleOutlined className="mr-2 text-green-500" />
            <span>HIPAA Compliant • 24/7 Support • Secure & Private</span>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-20 ${fadeInUpClass}`}
          >
            <Title level={2} className="!text-5xl font-bold !mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Why Choose Our Platform?
            </Title>
            <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We combine cutting-edge AI technology with expert dermatological care 
              to provide you with the best possible treatment experience.
            </Paragraph>
          </div>

          <div className={staggerClass}>
            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <div
                    className={`h-full ${fadeInUpClass} hover:-translate-y-2 hover:scale-105 transition-all duration-300`}
                  >
                    <Card 
                      hoverable
                      className="h-full text-center border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm group"
                    >
                      <div className="mb-8 group-hover:scale-110 transition-transform duration-300">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-purple-50 transition-colors duration-300">
                          {feature.icon}
                        </div>
                      </div>
                      <Title level={4} className="!mb-4 !text-xl group-hover:text-blue-600 transition-colors duration-300">
                        {feature.title}
                      </Title>
                      <Text className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </Text>
                    </Card>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Row gutter={[64, 64]} align="middle">
            <Col xs={24} lg={12}>
              <div className={`${fadeInUpClass}`}>
                <Title level={2} className="!text-5xl font-bold !mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Everything You Need for Healthy Hair & Skin
                </Title>
                <Paragraph className="text-xl text-gray-600 mb-12 leading-relaxed">
                  Our comprehensive platform provides all the tools and resources 
                  you need to maintain healthy hair and skin, with expert guidance 
                  every step of the way.
                </Paragraph>
                
                <div className={staggerClass}>
                  <Space direction="vertical" size="large" className="w-full">
                    {benefits.map((benefit, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center group ${fadeInUpClass}`}
                      >
                        <div className="flex-shrink-0 mr-6">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <CheckCircleOutlined className="text-white text-xl" />
                          </div>
                        </div>
                        <Text className="text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                          {benefit}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </div>
              </div>
            </Col>
            
            <Col xs={24} lg={12}>
              <div 
                className={`text-center ${fadeInUpClass}`}
              >
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-48 h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full mb-8 shadow-2xl">
                    <HeartOutlined className="text-8xl text-white" />
                  </div>
                  {/* Floating elements around the circle */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce delay-1000"></div>
                  <div className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-2000"></div>
                </div>
                <Title level={3} className="!text-3xl !mb-6 font-bold">
                  Join Thousands of Satisfied Patients
                </Title>
                <Paragraph className="text-xl text-gray-600 leading-relaxed">
                  Experience the difference that personalized, AI-powered dermatological 
                  care can make in your life.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="pt-24 pb-8 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-purple-800/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className={fadeInUpClass}>
            <Title level={2} className="!text-5xl md:!text-6xl font-bold !mb-8 text-white">
              Ready to Start Your Journey?
            </Title>
            <Paragraph className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our platform today and take the first step towards healthier hair and skin.
            </Paragraph>
            
            <div 
              className={`flex flex-col sm:flex-row gap-6 justify-center items-center ${fadeInUpClass}`}
            >
              <a
                href={URLS.PATIENT_LOGIN}
                className="group relative px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl overflow-hidden hover:scale-105 hover:-translate-y-1 block text-center no-underline"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <UserOutlined className="mr-3 text-xl" />
                  Get Started as Patient
                  <ArrowRightOutlined className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </a>
              
              <a
                href={URLS.DERM_LOGIN}
                className="group relative px-10 py-5 border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden hover:scale-105 hover:-translate-y-1 block text-center no-underline"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <MedicineBoxOutlined className="mr-3 text-xl" />
                  Join as Dermatologist
                  <ArrowRightOutlined className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Enhanced Footer */}
      <PublicFooter />
    </div>
  );
};

export default Home;
