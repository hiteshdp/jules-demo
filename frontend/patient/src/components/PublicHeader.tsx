import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Typography, Drawer } from 'antd';
import { URLS } from '../config/links';
import { 
  MenuOutlined, 
  CloseOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: URLS.HOME, label: 'Home', icon: <HeartOutlined /> },
    { path: URLS.ABOUT, label: 'About Us', icon: <GlobalOutlined /> },
    { path: URLS.CONTACT, label: 'Contact', icon: <PhoneOutlined /> },
  ];

  const legalItems = [
    { path: URLS.PRIVACY, label: 'Privacy Policy' },
    { path: URLS.TERMS, label: 'Terms of Service' },
  ];

  const handlePatientLogin = () => {
    window.location.href = URLS.PATIENT_LOGIN;
  };

  const handleDermatologistLogin = () => {
    window.location.href = URLS.DERM_LOGIN;
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <HeartOutlined className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <Title level={4} className="!mb-0 !text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Hair & Skin Health
              </Title>
              <Text className="text-xs text-gray-500 -mt-1">AI-Powered Dermatology</Text>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Legal Links */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
              {legalItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs text-gray-500 hover:text-blue-600 transition-colors duration-300 ${
                    isActive(item.path) ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              type="text"
              onClick={handlePatientLogin}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <UserOutlined />
              <span>Patient Login</span>
            </Button>
            <Button
              type="primary"
              onClick={handleDermatologistLogin}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MedicineBoxOutlined className="mr-2" />
              Dermatologist Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
          >
            <MenuOutlined className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <HeartOutlined className="text-white" />
            </div>
            <Title level={5} className="!mb-0">Hair & Skin Health</Title>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        className="lg:hidden"
        closeIcon={<CloseOutlined />}
      >
        <div className="space-y-6">
          {/* Navigation Links */}
          <div className="space-y-2">
            <Text className="text-gray-500 text-sm font-medium uppercase tracking-wide">Navigation</Text>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Legal Links */}
          <div className="space-y-2">
            <Text className="text-gray-500 text-sm font-medium uppercase tracking-wide">Legal</Text>
            {legalItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 ${
                  isActive(item.path) ? 'text-blue-600 font-medium' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
            <Button
              type="text"
              onClick={handlePatientLogin}
              className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <UserOutlined />
              <span>Patient Login</span>
            </Button>
            <Button
              type="primary"
              onClick={handleDermatologistLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MedicineBoxOutlined className="mr-2" />
              Dermatologist Login
            </Button>
          </div>

          {/* Contact Info */}
          <div className="pt-6 border-t border-gray-200">
            <Text className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-3 block">Contact</Text>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <PhoneOutlined />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MailOutlined />
                <span>support@hairskinhealth.com</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default PublicHeader;
