import React from 'react';
import SimplePageLayout from '../components/common/SimplePageLayout';

const Terms: React.FC = () => {
  return (
    <SimplePageLayout title="Terms of Service">
      <p>
        By using Hair & Skin Health Platform, you agree to our terms of service. These terms
        ensure safe, transparent, and responsible use of our AI dermatology solutions and
        teleconsultation features.
      </p>
      <p>
        Please review these terms regularly, as they may be updated to reflect new services,
        regulatory changes, or platform improvements.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Medical Disclaimer</h2>
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-6">
        <p className="text-yellow-800 font-semibold mb-2">
          ⚠️ Important Medical Notice
        </p>
        <p className="text-yellow-700">
          Our platform provides AI-powered assessments and connects you with dermatologists for 
          consultations. It is not intended to be a substitute for professional medical advice, 
          diagnosis, or treatment. Always seek the advice of your physician or other qualified 
          health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">User Responsibilities</h2>
      <p>
        By using our platform, you agree to:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>Provide accurate and complete information about your medical history and current conditions</li>
        <li>Use the platform in compliance with all applicable laws and regulations</li>
        <li>Maintain the confidentiality of your account credentials</li>
        <li>Report any suspicious or unauthorized activity on your account immediately</li>
        <li>Not use the platform for any illegal or unauthorized purposes</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Service Availability</h2>
      <p>
        We strive to provide reliable service, but we cannot guarantee uninterrupted access. 
        Our platform may be temporarily unavailable due to maintenance, updates, or technical issues.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Payment Terms</h2>
      <p>
        Payment for consultations and services is required in advance. All fees are non-refundable 
        unless otherwise specified. We use secure third-party payment processors to handle all 
        transactions.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Hair & Skin Health Platform shall not be liable 
        for any indirect, incidental, special, consequential, or punitive damages arising from 
        your use of our services.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. We will notify users of any 
        material changes via email or through the platform. Continued use of our services 
        after changes constitutes acceptance of the new terms.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Information</h2>
      <p>
        If you have any questions about these Terms of Service, please contact us at{' '}
        <a href="mailto:legal@hairskinhealth.com" className="text-indigo-600 hover:underline">
          legal@hairskinhealth.com
        </a>.
      </p>
      
      <p className="text-sm text-gray-500 mt-8">
        <strong>Last Updated:</strong> January 28, 2025
      </p>
    </SimplePageLayout>
  );
};

export default Terms;