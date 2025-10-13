import React from 'react';
import { Typography, Row, Col, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, SafetyOutlined } from '@ant-design/icons';
import { URLS } from '../../config/links';

const { Title, Paragraph, Text } = Typography;

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 relative mt-0">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Row gutter={[48, 48]}>
          <Col xs={24} md={8}>
            <div className="mb-8">
              <Title level={3} className="!text-white !mb-6 !text-2xl font-bold">
                Hair & Skin Health Platform
              </Title>
              <Paragraph className="text-gray-300 text-lg leading-relaxed mb-6">
                Empowering patients and dermatologists with AI-powered 
                dermatological care and personalized treatment solutions.
              </Paragraph>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-green-400">
                  <CheckCircleOutlined className="mr-2" />
                  <Text className="text-gray-300">Trusted Platform</Text>
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={8}>
            <div className="mb-8">
              <Title level={4} className="!text-white !mb-6 !text-xl font-semibold">
                Quick Links
              </Title>
              <Space direction="vertical" size="middle" className="w-full">
                <a href={URLS.TERMS} className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg hover:translate-x-2 transform">
                  Terms of Service
                </a>
                <a href={URLS.PRIVACY} className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg hover:translate-x-2 transform">
                  Privacy Policy
                </a>
                <a href={URLS.CONTACT} className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg hover:translate-x-2 transform">
                  Contact Us
                </a>
                <a href={URLS.CONTACT} className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg hover:translate-x-2 transform">
                  Support
                </a>
              </Space>
            </div>
          </Col>
          
          <Col xs={24} md={8}>
            <div className="mb-8">
              <Title level={4} className="!text-white !mb-6 !text-xl font-semibold">
                Contact Info
              </Title>
              <Space direction="vertical" size="middle" className="w-full">
                <div className="flex items-center group">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                      <ClockCircleOutlined className="text-white" />
                    </div>
                  </div>
                  <Text className="text-gray-300 text-lg">24/7 Support Available</Text>
                </div>
                <div className="flex items-center group">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                      <SafetyOutlined className="text-white" />
                    </div>
                  </div>
                  <Text className="text-gray-300 text-lg">HIPAA Compliant</Text>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
        
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Text className="text-gray-400 text-lg mb-4 md:mb-0">
              © {new Date().getFullYear()} Hair & Skin Health Platform. All rights reserved.
            </Text>
            <div className="flex items-center space-x-6">
              <Text className="text-gray-400 text-sm">Made with ❤️ for better healthcare</Text>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
