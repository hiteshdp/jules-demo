import React from 'react';
import SimplePageLayout from '../components/common/SimplePageLayout';

const About: React.FC = () => {
  return (
    <SimplePageLayout title="About Us">
      <p>
        Hair & Skin Health Platform empowers patients and dermatologists with AI-powered
        dermatology solutions. Our mission is to make expert skincare accessible, personalized,
        and data-driven — helping people achieve confidence in their skin.
      </p>
      <p>
        Through advanced AI diagnostics and a growing network of trusted dermatologists, we
        deliver reliable recommendations and virtual consultations that prioritize privacy
        and results.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
      <p>
        To democratize access to expert dermatological care through innovative AI technology, 
        making personalized skin and hair health solutions available to everyone, everywhere.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Values</h2>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li><strong>Patient-Centered Care:</strong> Your health and satisfaction are our top priority</li>
        <li><strong>Innovation:</strong> Leveraging cutting-edge AI for superior care</li>
        <li><strong>Integrity:</strong> Maintaining the highest standards of ethics and trust</li>
        <li><strong>Accessibility:</strong> Making quality dermatology care available to all</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Information</h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="mb-2">
          <strong>Email:</strong>{' '}
          <a href="mailto:info@hairskinhealth.com" className="text-indigo-600 hover:underline">
            info@hairskinhealth.com
          </a>
        </p>
        <p className="mb-2">
          <strong>Phone:</strong>{' '}
          <a href="tel:+1-555-123-4567" className="text-indigo-600 hover:underline">
            +1 (555) 123-4567
          </a>
        </p>
        <p className="mb-2">
          <strong>Address:</strong> 123 Health Street, Wellness City, HC 90210
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Our team is available 24/7 to assist you with any questions or concerns.
        </p>
      </div>
    </SimplePageLayout>
  );
};

export default About;