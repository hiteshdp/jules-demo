import React from 'react';
import SimplePageLayout from '../components/common/SimplePageLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <SimplePageLayout title="Privacy Policy">
      <p>
        We respect your privacy. Hair & Skin Health Platform collects only essential information
        to deliver secure and effective dermatology services. We never share or sell your data
        to third parties without consent.
      </p>
      <p>
        This policy explains how we collect, store, and protect your personal information while
        ensuring compliance with healthcare privacy standards.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as when you create an account, 
        schedule an appointment, or communicate with us. This may include:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>Personal information (name, email, phone number, date of birth)</li>
        <li>Health information (medical history, symptoms, photos, consultation notes)</li>
        <li>Account information (username, password, preferences)</li>
        <li>Payment information (processed securely by third-party providers)</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
      <p>
        We use the information we collect to provide, maintain, and improve our services:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>Provide AI-powered dermatology assessments and recommendations</li>
        <li>Connect you with qualified dermatologists for consultations</li>
        <li>Process payments and manage your account</li>
        <li>Send important updates about your treatment and platform features</li>
        <li>Improve our AI algorithms and medical services through anonymized data analysis</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>End-to-end encryption for all data transmission</li>
        <li>Secure data storage with regular security audits</li>
        <li>HIPAA-compliant infrastructure and processes</li>
        <li>Access controls and authentication protocols</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
      <p>
        You have the right to access, update, or delete your personal information. You can also:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>Request a copy of your data</li>
        <li>Correct inaccurate information</li>
        <li>Withdraw consent for data processing</li>
        <li>Request data deletion (subject to legal requirements)</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at{' '}
        <a href="mailto:privacy@hairskinhealth.com" className="text-indigo-600 hover:underline">
          privacy@hairskinhealth.com
        </a>.
      </p>
      
      <p className="text-sm text-gray-500 mt-8">
        <strong>Last Updated:</strong> January 28, 2025
      </p>
    </SimplePageLayout>
  );
};

export default PrivacyPolicy;