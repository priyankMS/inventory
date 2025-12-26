import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  message, 
  Card, 
  Table, 
  Space, 
  Tag, 
  Tooltip,
  Typography,
  Row,
  Col,
  Badge,
  Spin
} from "antd";
import { 
  DeleteOutlined, 
  ExclamationCircleOutlined, 
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../services/Productlist";
import { useMediaQuery } from "react-responsive";
import { formDataProduct } from "../interface/ProuductInerface";

const { confirm } = Modal;
const { Title, Text } = Typography;

const Product = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState<formDataProduct>({
    productsname: "",
    description: "",
    quantity: 0,
  });
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5
  });

  const { data, isLoading, refetch } = useGetAllProductsQuery({
    page: pagination.page,
    limit: pagination.limit
  });

  const [totalpages, setTotalPages] = useState<number>(0);
  
  const { data: totalProduct, refetch: totalRefetch } = useGetAllProductsQuery({
    page: 0,
    limit: 0
  });

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [allProduct, setAllProduct] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const isMobile = useMediaQuery({ maxWidth: 786 });
  const isTablet = useMediaQuery({ minWidth: 787, maxWidth: 1024 });

  useEffect(() => {
    if (data) {
      setAllProduct(data);
    }
  }, [data]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value) {
      setIsSearch(false);
      setAllProduct(data);
    } else {
      const regex = new RegExp(value, "i");
      const filteredData = totalProduct?.filter((product: formDataProduct) => 
        regex.test(product.productsname) || regex.test(product.quantity.toString())
      );
      setAllProduct(filteredData);
      setIsSearch(true);
      setTotalPages(filteredData?.length);
    }
  };

  const memoizedRefetch = useCallback(() => { 
    refetch();
    totalRefetch();
  }, [refetch, totalRefetch]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const date = new Date();
      values.createAt = date.toISOString();
      await createProduct(values);
      message.success("Product created successfully!");
      setIsModalVisible(false);
      memoizedRefetch();
      form.resetFields();
    } catch (error) {
      message.error("Failed to create product!");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const date = new Date();
      values.updatedAt = date.toISOString();
      if (!formData) throw new Error("Product ID is missing!");
      await updateProduct({ id: formData._id, updatedProduct: values });
      message.success("Product updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
      memoizedRefetch();
    } catch (error) {
      message.error("Failed to update product!");
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      confirm({
        title: "Delete Product",
        icon: <ExclamationCircleOutlined className="text-red-500" />,
        content: "Are you sure you want to delete this product? This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await deleteProduct(id);
            message.success("Product deleted successfully!");
            memoizedRefetch();
          } catch (error) {
            message.error("Failed to delete product!");
          }
        },
      });
    },
    [deleteProduct, memoizedRefetch]
  );

  const handleEdit = (record: formDataProduct) => {
    form.setFieldsValue(record);
    setFormData(record);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    form.resetFields();
    setFormData({
      productsname: "",
      description: "",
      quantity: 0,
    });
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const getQuantityColor = (quantity: number) => {
    if (quantity < 100) return "red";
    if (quantity < 300) return "orange";
    if (quantity < 500) return "gold";
    return "green";
  };

  const columns = [
    {
      title: "NO",
      dataIndex: "_id",
      render: (_, __, index: number) => (
        <Badge 
          count={index + 1} 
          style={{ backgroundColor: '#1890ff' }}
        />
      ),
      key: "_id",
      width: 80,
      align: "center" as const,
    },
    {
      title: "Product Name",
      dataIndex: "productsname",
      key: "productsname",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <ShoppingCartOutlined className="text-blue-500" />
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }} className="max-w-xs">
          {text || <Text type="secondary">No description</Text>}
        </Text>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "center" as const,
      render: (quantity: number) => (
        <Tag color={getQuantityColor(quantity)} className="text-sm font-semibold px-3 py-1">
          {quantity}
        </Tag>
      ),
      sorter: (a: formDataProduct, b: formDataProduct) => a.quantity - b.quantity,
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      width: 180,
      align: "center" as const,
      fixed: 'right' as const,
      render: (_, record: formDataProduct) => (
        <Space size="small">
          <Tooltip title="Edit Product">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Product">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id!)}
            />
          </Tooltip>
        </Space>
      ),
    }
  ];

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({
      page,
      limit: pageSize,
    });
  };

  useLayoutEffect(() => {
    if (!isSearch) {
      setTotalPages(totalProduct?.length);
    }
  }, [totalProduct, isSearch]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Space direction="vertical" align="center" size="large">
          <Spin size="large" />
          <Text className="text-gray-600 dark:text-gray-400">Loading products...</Text>
        </Space>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      {/* Header Section */}
      <Card className="mb-6 shadow-lg border-0 rounded-xl">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Title level={3} className="!mb-0 dark:text-white flex items-center gap-2">
              <ShoppingCartOutlined className="text-blue-500" />
              Products
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">
              Total: {totalpages || 0}
            </Text>
          </Col>
          
          <Col xs={24} md={12}>
            <Input
              size="large"
              placeholder="Search by product name or quantity..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="shadow-sm"
            />
          </Col>
          
          <Col xs={24} md={6} className="flex justify-end">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 shadow-md"
            >
              Add Product
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Content Section */}
      {isMobile ? (
        <div className="space-y-4">
          {(isSearch ? allProduct : totalProduct)?.length > 0 ? (
            (isSearch ? allProduct : totalProduct)?.map((product: formDataProduct, index: number) => (
              <Card
                key={product._id}
                className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge 
                      count={index + 1} 
                      style={{ backgroundColor: '#1890ff' }}
                    />
                    <Tag color={getQuantityColor(product.quantity)} className="font-semibold">
                      Qty: {product.quantity}
                    </Tag>
                  </div>
                  
                  <div>
                    <Text type="secondary" className="text-xs">Product Name</Text>
                    <Title level={5} className="!mb-0 !mt-1">
                      {product.productsname}
                    </Title>
                  </div>
                  
                  <div>
                    <Text type="secondary" className="text-xs">Description</Text>
                    <Text className="block mt-1">
                      {product.description || <Text type="secondary">No description</Text>}
                    </Text>
                  </div>
                  
                  <Space size="small" className="w-full mt-4" direction="horizontal">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-500"
                      block
                    >
                      Edit
                    </Button>
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(product._id!)}
                      className="flex-1"
                      block
                    >
                      Delete
                    </Button>
                  </Space>
                </div>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <Text className="text-gray-500 dark:text-gray-400">
                No products found
              </Text>
            </Card>
          )}
        </div>
      ) : (
        <Card className="shadow-lg border-0 rounded-xl">
          <Table
            columns={columns}
            dataSource={allProduct}
            rowKey="_id"
            loading={isLoading}
            scroll={{ x: 1000 }}
            rowClassName={(record, index) =>
              index % 2 === 0
                ? "bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                : "bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
            }
            pagination={{
              position: ["bottomCenter"],
              pageSize: pagination.limit,
              current: pagination.page,
              total: totalpages,
              showTotal: (total, range) => (
                <Text className="dark:text-gray-400">
                  Showing {range[0]}-{range[1]} of {total} products
                </Text>
              ),
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "15", "20", "50"],
              onChange: handlePaginationChange,
            }}
          />
        </Card>
      )}

      {/* Modal */}
      <Modal
        title={
          <Space className="text-lg">
            <ShoppingCartOutlined className="text-blue-500" />
            <Text strong>{isEditing ? "Edit Product" : "Create New Product"}</Text>
          </Space>
        }
        open={isModalVisible}
        onOk={isEditing ? handleUpdate : handleCreate}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={isEditing ? "Update" : "Create"}
        cancelText="Cancel"
        width={isMobile ? "95%" : 600}
        className="top-8"
        okButtonProps={{ 
          className: "bg-blue-500 hover:bg-blue-600",
          size: "large"
        }}
        cancelButtonProps={{ size: "large" }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={isEditing ? formData : {}}
          onValuesChange={(_, allValues) => {
            setFormData((prev: formDataProduct) => ({ ...prev, ...allValues }));
          }}
          className="mt-6"
        >
          <Form.Item
            label={<Text strong>Product Name</Text>}
            name="productsname"
            rules={[
              { required: true, message: "Please enter product name!" },
              { min: 3, message: "Product name must be at least 3 characters" }
            ]}
          >
            <Input 
              size="large"
              placeholder="Enter product name"
              prefix={<ShoppingCartOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>Description</Text>}
            name="description"
          >
            <Input.TextArea
              size="large"
              placeholder="Enter product description (optional)"
              rows={4}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>Quantity</Text>}
            name="quantity"
            rules={[
              { required: true, message: "Please enter quantity!" },
              { type: "number", min: 1, message: "Quantity must be at least 1" }
            ]}
          >
            <InputNumber
              size="large"
              min={1}
              className="w-full"
              placeholder="Enter quantity"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;