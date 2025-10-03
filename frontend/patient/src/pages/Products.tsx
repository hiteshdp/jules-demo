import React, { useEffect, useState } from 'react';
import { ShoppingBagIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  image?: string;
  requires_prescription: boolean;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simulate API call to get products
    const fetchProducts = async () => {
      try {
        // In a real app, this would be an API call
        const mockProducts: Product[] = [
          {
            id: 1,
            name: 'Gentle Hair Loss Shampoo',
            description: 'A gentle, sulfate-free shampoo specifically formulated for hair loss prevention and scalp health.',
            category: 'shampoo',
            brand: 'HairCare Pro',
            price: 1299.00,
            requires_prescription: false,
          },
          {
            id: 2,
            name: 'Hair Growth Serum',
            description: 'Concentrated serum with minoxidil and natural extracts to promote hair growth.',
            category: 'treatment',
            brand: 'HairCare Pro',
            price: 2499.00,
            requires_prescription: true,
          },
          {
            id: 3,
            name: 'Biotin Hair Supplements',
            description: 'High-potency biotin supplements to support healthy hair growth from within.',
            category: 'supplement',
            brand: 'HairCare Pro',
            price: 899.00,
            requires_prescription: false,
          },
          {
            id: 4,
            name: 'Scalp Massage Oil',
            description: 'Nourishing oil blend for scalp massage to improve circulation and hair health.',
            category: 'oil',
            brand: 'HairCare Pro',
            price: 699.00,
            requires_prescription: false,
          },
          {
            id: 5,
            name: 'Hair Loss Conditioner',
            description: 'Moisturizing conditioner with keratin and amino acids to strengthen hair.',
            category: 'conditioner',
            brand: 'HairCare Pro',
            price: 1099.00,
            requires_prescription: false,
          },
        ];
        
        setTimeout(() => {
          setProducts(mockProducts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['all', 'shampoo', 'treatment', 'supplement', 'oil', 'conditioner'];
  
  const productsArray = Array.isArray(products) ? products : [];
  const filteredProducts = selectedCategory === 'all' 
    ? productsArray 
    : productsArray.filter(product => product.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shampoo':
        return 'bg-blue-100 text-blue-800';
      case 'treatment':
        return 'bg-red-100 text-red-800';
      case 'supplement':
        return 'bg-green-100 text-green-800';
      case 'oil':
        return 'bg-yellow-100 text-yellow-800';
      case 'conditioner':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse our curated selection of hair care products.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                  {product.category}
                </span>
                {product.requires_prescription && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Prescription Required
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-lg font-semibold text-gray-900">
                  <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-1" />
                  {product.price.toLocaleString()}
                </div>
                
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                  <ShoppingBagIcon className="h-4 w-4 mr-2" />
                  Add to Cart
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Brand: {product.brand}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try selecting a different category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
