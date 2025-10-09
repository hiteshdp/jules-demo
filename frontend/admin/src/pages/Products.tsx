// Generated via prompt: prompts/antd_admin_remaining_pages_v1.md
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productSlice';
import { 
  Card, 
  Table, 
  Tag, 
  Avatar, 
  Typography, 
  Space, 
  Empty, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Switch,
  Popconfirm,
} from 'antd';
import { 
  ShoppingOutlined, 
  PlusOutlined, 
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  is_active: boolean;
}

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.product);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSubmit = async (values: any) => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, data: values })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(values)).unwrap();
        toast.success('Product created successfully');
      }
      setShowCreateForm(false);
      setEditingProduct(null);
      form.resetFields();
    } catch (error) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      is_active: product.is_active,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (product: any) => {
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleView = (product: any) => {
    setViewingProduct(product);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleViewCancel = () => {
    setViewingProduct(null);
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.image} 
            icon={<ShoppingOutlined />} 
            size={40}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const categoryLabels: { [key: string]: string } = {
          'prescription': 'Prescription',
          'cosmetic': 'Cosmetic',
          'lifestyle_support': 'Lifestyle Support'
        };
        return categoryLabels[category] || category;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price}`,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
            title="View"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title="Delete Product"
            description={`Are you sure you want to delete "${record.name}"? This action cannot be undone.`}
            onConfirm={() => handleDelete(record)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okType="danger"
            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
          >
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />} 
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Space direction="vertical" size={4}>
          <Title level={2} style={{ margin: 0 }}>
            Products
          </Title>
          <Text type="secondary">
            Manage the product catalog and inventory.
          </Text>
        </Space>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setShowCreateForm(true)}
          size="large"
        >
          Add Product
        </Button>
      </div>

      <Card>
        {(!products || products.length === 0) && !loading ? (
          <Empty
            image={<ShoppingOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description="Get started by adding your first product."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={Array.isArray(products) ? products : []}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} products`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={showCreateForm}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter product description' }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              <Option value="prescription">Prescription</Option>
              <Option value="cosmetic">Cosmetic</Option>
              <Option value="lifestyle_support">Lifestyle Support</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Price (per Month)"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              formatter={value => `₹ ${value}`}
              parser={(value: string | undefined) => {
                const numValue = value ? value.replace('₹ ', '') : '';
                return numValue === '' ? 0 : parseFloat(numValue);
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="Product Image URL"
          >
            <Input placeholder="Enter image URL (optional)" />
          </Form.Item>
          
          <Form.Item
            name="is_active"
            label="Active Status"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Product Modal */}
      <Modal
        title="Product Details"
        open={!!viewingProduct}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Close
          </Button>
        ]}
        width={600}
        destroyOnHidden
      >
        {viewingProduct && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
              <Avatar 
                src={viewingProduct.image} 
                icon={<ShoppingOutlined />} 
                size={80}
                style={{ marginRight: '16px' }}
              />
              <div style={{ flex: 1 }}>
                <Title level={3} style={{ margin: '0 0 8px 0' }}>
                  {viewingProduct.name}
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  {viewingProduct.description}
                </Text>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <Text strong>Category: </Text>
                    <Tag color="blue">
                      {viewingProduct.category === 'prescription' ? 'Prescription' :
                       viewingProduct.category === 'cosmetic' ? 'Cosmetic' :
                       viewingProduct.category === 'lifestyle_support' ? 'Lifestyle Support' :
                       viewingProduct.category}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Price: </Text>
                    <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                      ₹{viewingProduct.price}
                    </Text>
                    <Text type="secondary" style={{ marginLeft: '4px' }}>/month</Text>
                  </div>
                  <div>
                    <Text strong>Status: </Text>
                    <Tag color={viewingProduct.is_active ? 'green' : 'red'}>
                      {viewingProduct.is_active ? 'Active' : 'Inactive'}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
            
            {viewingProduct.image && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Product Image:</Text>
                <img 
                  src={viewingProduct.image} 
                  alt={viewingProduct.name}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                  }}
                />
              </div>
            )}
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fafafa', 
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>Product Information:</Text>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <Text type="secondary">Product ID:</Text>
                  <br />
                  <Text strong>#{viewingProduct.id}</Text>
                </div>
                <div>
                  <Text type="secondary">Created:</Text>
                  <br />
                  <Text strong>
                    {new Date(viewingProduct.created_at).toLocaleDateString()}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Last Updated:</Text>
                  <br />
                  <Text strong>
                    {new Date(viewingProduct.updated_at).toLocaleDateString()}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Category Type:</Text>
                  <br />
                  <Text strong>
                    {viewingProduct.category === 'prescription' ? 'Prescription Medicine' :
                     viewingProduct.category === 'cosmetic' ? 'Cosmetic Product' :
                     viewingProduct.category === 'lifestyle_support' ? 'Lifestyle Support' :
                     'Other'}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Space>
  );
};

export default Products;
