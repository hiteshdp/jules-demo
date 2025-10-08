import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Button, Typography, Space } from 'antd';
import { ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState } from '../components/common';

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

const { Title, Text } = Typography;

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
        return 'blue';
      case 'treatment':
        return 'red';
      case 'supplement':
        return 'green';
      case 'oil':
        return 'orange';
      case 'conditioner':
        return 'purple';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Browse our curated selection of hair care products."
      />

      {/* Category Filter */}
      <Card>
        <Space wrap>
          {categories.map((category) => (
            <Button
              key={category}
              type={selectedCategory === category ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </Space>
      </Card>

      {/* Products Grid */}
      <Row gutter={[16, 16]}>
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} lg={8} key={product.id}>
            <Card
              hoverable
              className="h-full"
              actions={[
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  className="w-full"
                >
                  Add to Cart
                </Button>
              ]}
            >
              <div className="flex items-center justify-between mb-4">
                <Tag color={getCategoryColor(product.category)}>
                  {product.category}
                </Tag>
                {product.requires_prescription && (
                  <Tag color="red">Prescription Required</Tag>
                )}
              </div>
              
              <Title level={4} className="!mb-2">
                {product.name}
              </Title>
              
              <Text type="secondary" className="block mb-4">
                {product.description}
              </Text>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <DollarOutlined className="mr-1 text-gray-400" />
                  <Text strong className="text-lg">
                    ₹{product.price.toLocaleString()}
                  </Text>
                </div>
              </div>
              
              <Text type="secondary" className="text-xs">
                Brand: {product.brand}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredProducts.length === 0 && (
        <EmptyState
          icon={<ShoppingCartOutlined className="text-4xl text-gray-400" />}
          title="No products found"
          description="Try selecting a different category."
        />
      )}
    </div>
  );
};

export default Products;
