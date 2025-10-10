import React from 'react';
import SimplePageLayout from '../components/common/SimplePageLayout';

const Contact: React.FC = () => {
  return (
    <SimplePageLayout title="Contact Us">
      <p>
        We'd love to hear from you! Our team is available 24/7 to assist you with your account, 
        appointments, or platform feedback.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Get in Touch</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Inquiries</h3>
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
          <p className="text-sm text-gray-500">
            Monday - Friday: 9:00 AM - 6:00 PM (PST)
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Support</h3>
          <p className="mb-2">
            <strong>Email:</strong>{' '}
            <a href="mailto:support@hairskinhealth.com" className="text-indigo-600 hover:underline">
              support@hairskinhealth.com
            </a>
          </p>
          <p className="mb-2">
            <strong>Phone:</strong>{' '}
            <a href="tel:+1-555-123-4568" className="text-indigo-600 hover:underline">
              +1 (555) 123-4568
            </a>
          </p>
          <p className="text-sm text-gray-500">
            24/7 Support Available
          </p>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Office Location</h2>
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <p className="mb-2">
          <strong>Address:</strong> 123 Health Street, Suite 100, Wellness City, HC 90210
        </p>
        <p className="mb-2">
          <strong>Business Hours:</strong> Monday - Friday: 9:00 AM - 5:00 PM (PST)
        </p>
        <p className="text-sm text-gray-500">
          <strong>Note:</strong> Our office is currently operating with limited in-person visits. 
          Most consultations are conducted virtually through our secure platform.
        </p>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Emergency Contact</h2>
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
        <p className="text-red-800 font-semibold mb-2">
          ⚠️ Medical Emergency
        </p>
        <p className="text-red-700 mb-2">
          If you are experiencing a medical emergency, please call 911 or your local emergency 
          number immediately. Do not use this platform for urgent medical issues.
        </p>
        <p className="text-sm text-red-600">
          For non-emergency medical concerns, please contact your primary care physician or 
          visit the nearest urgent care center.
        </p>
      </div>
    </SimplePageLayout>
  );
};

export default Contact;