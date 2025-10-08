// Generated via prompt: prompts/antd_admin_remaining_pages_v1.md
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchProducts, createProduct, updateProduct } from '../store/slices/productSlice';
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
} from 'antd';
import { 
  ShoppingOutlined, 
  PlusOutlined, 
  EditOutlined 
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
  brand: string;
  ingredients: string;
  usage_instructions: string;
  price: number;
  requires_prescription: boolean;
  stock_quantity: number;
  is_active: boolean;
}

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.product);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
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
      brand: product.brand,
      ingredients: product.ingredients,
      usage_instructions: product.usage_instructions,
      price: product.price,
      requires_prescription: product.requires_prescription,
      stock_quantity: product.stock_quantity,
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <Space>
          <Avatar icon={<ShoppingOutlined />} />
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
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
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
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => handleEdit(record)}
          title="Edit"
        />
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
        {products.length === 0 && !loading ? (
          <Empty
            image={<ShoppingOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description="Get started by adding your first product."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={products}
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
        destroyOnClose
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
              <Option value="shampoo">Shampoo</Option>
              <Option value="treatment">Treatment</Option>
              <Option value="supplement">Supplement</Option>
              <Option value="oil">Oil</Option>
              <Option value="conditioner">Conditioner</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: 'Please enter brand' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="ingredients"
            label="Ingredients"
            rules={[{ required: true, message: 'Please enter ingredients' }]}
          >
            <TextArea rows={2} />
          </Form.Item>
          
          <Form.Item
            name="usage_instructions"
            label="Usage Instructions"
            rules={[{ required: true, message: 'Please enter usage instructions' }]}
          >
            <TextArea rows={2} />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Price"
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
            name="stock_quantity"
            label="Stock Quantity"
            rules={[{ required: true, message: 'Please enter stock quantity' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
          
          <Form.Item
            name="requires_prescription"
            label="Requires Prescription"
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
    </Space>
  );
};

export default Products;
