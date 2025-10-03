import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { LightBulbIcon, ShoppingBagIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface Recommendation {
  type: string;
  title: string;
  description: string;
  product_id?: number;
  priority: string;
}

const Recommendations: React.FC = () => {
  const { isSubmitted } = useSelector((state: RootState) => state.quiz);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get recommendations
    const fetchRecommendations = async () => {
      try {
        // In a real app, this would be an API call
        const mockRecommendations: Recommendation[] = [
          {
            type: 'product',
            title: 'Gentle Shampoo for Hair Loss',
            description: 'Based on your quiz responses, we recommend a gentle, sulfate-free shampoo.',
            product_id: 1,
            priority: 'high'
          },
          {
            type: 'lifestyle',
            title: 'Improve Sleep Pattern',
            description: 'Getting 7-8 hours of quality sleep can help reduce hair loss.',
            priority: 'medium'
          },
          {
            type: 'consultation',
            title: 'Book Consultation',
            description: 'Consider booking a consultation with our dermatologist for personalized treatment.',
            priority: 'high'
          }
        ];
        
        setTimeout(() => {
          setRecommendations(mockRecommendations);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <ShoppingBagIcon className="h-6 w-6" />;
      case 'consultation':
        return <CalendarDaysIcon className="h-6 w-6" />;
      default:
        return <LightBulbIcon className="h-6 w-6" />;
    }
  };

  if (!isSubmitted) {
    return (
      <div className="text-center py-12">
        <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Complete the hair loss quiz to get personalized recommendations.
        </p>
        <div className="mt-6">
          <a
            href="/quiz"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Take Quiz
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Based on your quiz responses, here are our recommendations for your hair health journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {(Array.isArray(recommendations) ? recommendations : []).map((recommendation, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-blue-600">
                    {getTypeIcon(recommendation.type)}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {recommendation.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {recommendation.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                {recommendation.type === 'product' && (
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    View Product
                  </button>
                )}
                {recommendation.type === 'consultation' && (
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Book Consultation
                  </button>
                )}
                {recommendation.type === 'lifestyle' && (
                  <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    Learn More
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          Additional Resources
        </h3>
        <p className="text-blue-700 mb-4">
          For more personalized advice, consider booking a consultation with one of our dermatologists.
        </p>
        <div className="flex space-x-4">
          <a
            href="/appointments"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Book Appointment
          </a>
          <a
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
          >
            Browse Products
          </a>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
