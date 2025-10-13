import React from 'react';
import PublicFooter from './PublicFooter';

interface SimplePageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const SimplePageLayout: React.FC<SimplePageLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 leading-relaxed">
          <h1 className="text-3xl font-semibold mb-6 text-gray-900">{title}</h1>
          <div className="text-gray-600 text-lg leading-relaxed">
            {children}
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default SimplePageLayout;
