import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Space,
  Button,
  Tooltip,
  Upload,
  message,
  Modal,
  Form,
  Select,
  InputNumber,
  Image,
  Card,
  Grid,
  Spin,
  Popover,
  Col,
  Row,
  Typography,
  Badge,
  Tag,
  Divider,
} from "antd";
import type { TableColumnsType } from "antd";

import {
  EyeOutlined,
  UploadOutlined,
  PlusOutlined,
  ReloadOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  FileImageOutlined,
  ShopOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  useGetAllOrderlistQuery,
  useCreateOrderlistMutation,
} from "../services/Orderlist";
import { useGetAllProductsQuery } from "../services/Productlist";

import axios from "axios";
import { useGetAllCompanyQuery } from "../services/Company";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import {
  ComapanyOrderList,
  companyOrderList,
  DateRange,
  orderDetail,
  orderListDetails,
  repeateOrder,
  selectedProduct,
  selectorderDetails,
  state,
} from "../interface/orderlistInterface";

import DateShow from "./date/DateShow";
import { FaFilter } from "react-icons/fa";

dayjs.extend(customParseFormat);

const { Option } = Select;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Orderlist = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
  });

  const { data, isLoading, error, refetch } = useGetAllOrderlistQuery({
    page: pagination.page,
    limit: pagination.limit,
  });
  
  const { data: totalOrderList, refetch: refetchorder } = useGetAllOrderlistQuery({
    page: 0,
    limit: 0,
  });

  const {
    data: products,
    refetch: productRefetch,
  } = useGetAllProductsQuery({
    page: 0,
    limit: 0,
  });

  const { data: company } = useGetAllCompanyQuery({});
  const [createOrderlist] = useCreateOrderlistMutation();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [createOrderModalVisible, setCreateOrderModalVisible] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<selectorderDetails>();
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>();
  const [visibleProduct, setVisibleProduct] = useState<boolean>(false);
  const [isRepeatOrder, setIsRepeatOrder] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string[] | null>(null);
  const [allData, setAllData] = useState<orderListDetails[]>(data);
  const [filteredData, setFilteredData] = useState<orderListDetails[]>([]);
  const [showProductsTable, setShowProductsTable] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const [state, setState] = useState<state>({
    startDate: "",
    endDate: "",
  });

  const screens = useBreakpoint();
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      setAllData(data);
    }
  }, [data]);

  useEffect(() => {
    if (selectedProducts.includes(undefined) || selectedProducts.includes(null)) {
      const filteredProducts = selectedProducts.filter(
        (product: selectedProduct) => product !== undefined && product !== null
      );
      setSelectedProducts(filteredProducts);
    }
  }, [selectedProducts]);

  const stripTime = (date: string) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate.toISOString();
  };

  useEffect(() => {
    if (selectedDate) {
      const [startDate, endDate] = selectedDate;
      const filteredData = totalOrderList?.filter((order: orderListDetails) => {
        const orderDate = stripTime(order.date);
        return orderDate >= stripTime(startDate) && orderDate <= stripTime(endDate);
      });
      setFilteredData(filteredData);
    } else {
      setFilteredData(allData);
    }
  }, [selectedDate, allData, totalOrderList]);

  const handleView = useCallback((record: selectorderDetails) => {
    setSelectedOrder(record);
    setModalVisible(true);
  }, []);

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleCreateOrder = useCallback(() => {
    setIsRepeatOrder(false);
    setSelectedCompany(undefined);
    setSelectedProducts([]);
    setShowProductsTable([]);
    setVisibleProduct(false);
    form.resetFields();
    setCreateOrderModalVisible(true);
  }, [form]);

  const handleRepeatOrder = useCallback(
    (record: repeateOrder) => {
      const newSelectedProducts = record.orderdetail.map((order: orderDetail) => ({
        productname: order.productname,
        quantity: order.quantity,
      }));
      setIsRepeatOrder(true);
      setSelectedProducts(newSelectedProducts);
      form.setFieldsValue(record);
      setCreateOrderModalVisible(true);
    },
    [form]
  );

  const handleCreateOrderCancel = useCallback(() => {
    setSelectedProducts([]);
    setShowProductsTable([]);
    setSelectedCompany(undefined);
    form.resetFields();
    setCreateOrderModalVisible(false);
    setVisibleProduct(false);
    setIsRepeatOrder(false);
  }, [form]);

  useEffect(() => {
    if (selectedCompany && !isRepeatOrder) {
      const selectedCompanyData = company?.find(
        (company: companyOrderList) => company.company === selectedCompany
      );
      if (selectedCompanyData) {
        const products = selectedCompanyData.products;
        setSelectedProducts(
          products.map((product: string) => ({
            productname: product,
            quantity: 0,
          }))
        );
        setShowProductsTable(products);
        setVisibleProduct(true);
      }
    }
  }, [selectedCompany, company, isRepeatOrder]);

  const handleCreateOrderlist = async () => {
    try {
      const values = await form.validateFields();
      const { companyname } = values;

      const updatedProducts = selectedProducts
        .filter((product: orderDetail) => product.quantity > 0)
        .map((product: orderDetail) => ({
          productname: product.productname,
          quantity: product.quantity,
        }));

      if (updatedProducts.length === 0) {
        message.error("Please add at least one product with quantity greater than 0");
        return;
      }

      const currentDate = new Date();
      const newOrderlistData = {
        companyname,
        orderdetail: updatedProducts,
        date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`,
      };
      
      await createOrderlist(newOrderlistData).unwrap();
      message.success("Order created successfully!");
      setCreateOrderModalVisible(false);
      setSelectedProducts([]);
      setSelectedCompany(undefined);
      setShowProductsTable([]);
      setVisibleProduct(false);
      form.resetFields();
      refetch();
      refetchorder();
      productRefetch();
    } catch (error: any) {
      message.error(`Failed to create order: ${error.data?.message || error.message}`);
    }
  };

  const uniqueCompany = useMemo(() => {
    return Array.from(new Set(company?.map((a: ComapanyOrderList) => a.company))).map((value) => {
      return company.find((company: ComapanyOrderList) => company.company === value);
    });
  }, [company]);

  const columns: TableColumnsType = [
    {
      title: "No",
      dataIndex: "_id",
      key: "_id",
      render: (_, __, index) => (
        <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
      ),
      width: 80,
      align: "center" as const,
    },
    {
      title: "Company Name",
      dataIndex: "companyname",
      key: "companyname",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <ShopOutlined className="text-blue-500" />
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (createdAt: string) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-gray-400" />
          <Text>{new Date(createdAt).toLocaleDateString()}</Text>
        </div>
      ),
      width: 150,
      align: "center" as const,
    },
    {
      title: "Action",
      width: 250,
      key: "action",
      fixed: 'right' as const,
      align: "center" as const,
      render: (_, record: orderListDetails) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              className="bg-green-500 hover:bg-green-600"
            />
          </Tooltip>
          <Tooltip title={record.invoice ? "View Invoice" : "Upload Invoice"}>
            {!record.invoice ? (
              <Upload beforeUpload={(file) => handleUpload(record, file)} showUploadList={false}>
                <Button icon={<UploadOutlined />} />
              </Upload>
            ) : (
              <Image
                width={32}
                height={32}
                src={`data:image/png;base64,${record.invoice}`}
                className="rounded"
                preview={{
                  mask: <FileImageOutlined />,
                }}
              />
            )}
          </Tooltip>
          <Tooltip title="Repeat Order">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleRepeatOrder(record)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Repeat
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleUpload = async (record: orderListDetails, file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      await axios.post(
        `http://localhost:3000/order/invoice/${record._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      message.success(`${file.name} uploaded successfully!`);
      await refetch();
    } catch (error) {
      message.error("Failed to upload invoice");
    }
    return false;
  };

  const handleChange = useCallback(
    (name: string) => (e: any) => {
      const value = e?.target?.value ?? e;
      setState((prevState) => ({ ...prevState, [name]: value }));
    },
    []
  );

  const handleOpenChange = () => {
    setOpen(!open);
  };

  const handleSubmitDates = useCallback(() => {
    const { startDate, endDate } = state;
    if (!startDate || !endDate) return;
    setSelectedDate([startDate, endDate]);
    setOpen(false);
  }, [state]);

  const handleReset = () => {
    setState({ startDate: "", endDate: "" });
    setSelectedDate(null);
  };

  const chartFilterInput: DateRange[] = useMemo(() => {
    const { startDate, endDate } = state;
    return [
      {
        name: "startDate",
        label: "From Date (MM/DD/YYYY)",
        placeholder: "MM/DD/YYYY",
        disableDates: "FUTURE",
        value: startDate,
      },
      {
        name: "endDate",
        label: "To Date (MM/DD/YYYY)",
        placeholder: "MM/DD/YYYY",
        disableDates: "FUTURE",
        value: endDate,
      },
    ];
  }, [state]);

  const content = useMemo(
    () => (
      <div className="p-4 w-72">
        <Title level={5} className="mb-4">Filter by Date Range</Title>
        {chartFilterInput.map((item, index) => (
          <div key={index} className="mb-4">
            <DateShow
              size="large"
              onChange={handleChange(item.name)}
              disabled={false}
              {...item}
            />
          </div>
        ))}
        <Row gutter={12} className="mt-6">
          <Col span={12}>
            <Button block size="large" onClick={handleReset} icon={<ReloadOutlined />}>
              Reset
            </Button>
          </Col>
          <Col span={12}>
            <Button block type="primary" size="large" onClick={handleSubmitDates}>
              Apply
            </Button>
          </Col>
        </Row>
      </div>
    ),
    [chartFilterInput, handleChange, handleSubmitDates, handleReset]
  );

  const handleProductChange = (value: string, index: number) => {
    const newIndex = showProductsTable.length + index;
    const newProducts = [...selectedProducts];
    newProducts[newIndex] = { ...newProducts[newIndex], productname: value };
    setSelectedProducts(newProducts);
  };

  const removeIndex = (name: number) => {
    if (selectedProducts.length > showProductsTable.length) {
      const removeIndex = showProductsTable.length + name;
      const newProducts = selectedProducts
        .slice(0, removeIndex)
        .concat(selectedProducts.slice(removeIndex + 1));
      setSelectedProducts(newProducts);
    }
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, limit: pageSize });
  };

  const totalPage = useMemo(() => {
    return selectedDate ? filteredData.length : totalOrderList?.length || 0;
  }, [filteredData?.length, selectedDate, totalOrderList?.length]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Space direction="vertical" align="center" size="large">
          <Spin size="large" />
          <Text className="text-gray-600 dark:text-gray-400">Loading orders...</Text>
        </Space>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Text type="danger">Error loading orders</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      {/* Header Section */}
      <Card className="mb-6 shadow-lg border-0 rounded-xl">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Title level={3} className="!mb-0 dark:text-white flex items-center gap-2">
              <ShoppingOutlined className="text-blue-500" />
              Order List
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">
              Total Orders: {totalPage}
            </Text>
          </Col>

          <Col xs={24} md={12} className="flex justify-end gap-3">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateOrder}
              className="bg-blue-500 hover:bg-blue-600 shadow-md"
            >
              Create Order
            </Button>

            <Popover
              content={content}
              trigger="click"
              placement="bottomRight"
              open={open}
              onOpenChange={handleOpenChange}
            >
              <Badge dot={selectedDate !== null} offset={[-5, 5]}>
                <Button
                  size="large"
                  icon={<FaFilter />}
                  className="hover:border-blue-500 hover:text-blue-500"
                >
                  Filter
                </Button>
              </Badge>
            </Popover>
          </Col>
        </Row>
      </Card>

      {/* Content Section */}
      {screens.md ? (
        <Card className="shadow-lg border-0 rounded-xl">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            loading={isLoading}
            scroll={{ x: 1000 }}
            rowClassName={(_, index) =>
              index % 2 === 0
                ? "bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                : "bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
            }
            pagination={{
              pageSize: pagination.limit,
              current: pagination.page,
              total: totalPage,
              showSizeChanger: true,
              showTotal: (total, range) => (
                <Text className="dark:text-gray-400">
                  Showing {range[0]}-{range[1]} of {total} orders
                </Text>
              ),
              pageSizeOptions: ["5", "10", "15", "20", "50"],
              onChange: handlePaginationChange,
            }}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {(selectedDate ? filteredData : totalOrderList)?.length > 0 ? (
            (selectedDate ? filteredData : totalOrderList)?.map((item: orderListDetails, index: number) => (
              <Card
                key={item._id}
                className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <CalendarOutlined />
                      <Text type="secondary">{new Date(item.date).toLocaleDateString()}</Text>
                    </div>
                  </div>

                  <div>
                    <Text type="secondary" className="text-xs">Company Name</Text>
                    <Title level={5} className="!mb-0 !mt-1 flex items-center gap-2">
                      <ShopOutlined className="text-blue-500" />
                      {item.companyname}
                    </Title>
                  </div>

                  <Space size="small" className="w-full" direction="vertical">
                    <Space size="small" className="w-full">
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(item)}
                        className="flex-1 bg-green-500"
                        block
                      >
                        View
                      </Button>
                      {!item.invoice ? (
                        <Upload beforeUpload={(file) => handleUpload(item, file)} showUploadList={false}>
                          <Button icon={<UploadOutlined />} block>
                            Upload
                          </Button>
                        </Upload>
                      ) : (
                        <Image
                          width={40}
                          height={40}
                          src={`data:image/png;base64,${item.invoice}`}
                          className="rounded"
                        />
                      )}
                    </Space>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleRepeatOrder(item)}
                      className="bg-blue-500"
                      block
                    >
                      Repeat Order
                    </Button>
                  </Space>
                </div>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <Text className="text-gray-500 dark:text-gray-400">No orders found</Text>
            </Card>
          )}
        </div>
      )}

      {/* View Order Modal */}
      <Modal
        title={
          <Space className="text-lg">
            <ShoppingOutlined className="text-blue-500" />
            <Text strong>Order Details</Text>
          </Space>
        }
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={screens.xs ? "95%" : 600}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <Card className="bg-gray-50" bodyStyle={{ padding: '16px' }}>
              <Space direction="vertical" size="small" className="w-full">
                <div className="flex items-center gap-2">
                  <Text strong>Company:</Text>
                  <Text>{selectedOrder.companyname}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text strong>Date:</Text>
                  <Text>{new Date(selectedOrder.date).toLocaleDateString()}</Text>
                </div>
              </Space>
            </Card>

            <Divider orientation="left">
              <Text strong>Products Ordered</Text>
            </Divider>

            <div className="space-y-2">
              {selectedOrder.orderdetail.map((detail, index: number) => (
                <Card key={index} size="small" className="bg-white">
                  <Space direction="vertical" size="small" className="w-full">
                    <div className="flex justify-between">
                      <Text strong>{detail.productname}</Text>
                      <Tag color="blue">Qty: {detail.quantity}</Tag>
                    </div>
                  </Space>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Repeat Order Modal */}
      <Modal
        title={
          <Space className="text-lg">
            <ShoppingOutlined className="text-blue-500" />
            <Text strong>{isRepeatOrder ? "Repeat Order" : "Create New Order"}</Text>
          </Space>
        }
        open={createOrderModalVisible}
        onCancel={handleCreateOrderCancel}
        onOk={handleCreateOrderlist}
        okText={isRepeatOrder ? "Repeat Order" : "Create Order"}
        cancelText="Cancel"
        width={screens.xs ? "95%" : 700}
        className="top-8"
        okButtonProps={{
          className: "bg-blue-500 hover:bg-blue-600",
          size: "large",
        }}
        cancelButtonProps={{ size: "large" }}
      >
        <Form form={form} layout="vertical" className="mt-6">
          {isRepeatOrder ? (
            <>
              <Form.Item
                name="companyname"
                label={<Text strong>Company Name</Text>}
                rules={[{ required: true, message: "Select a company" }]}
              >
                <Select size="large" disabled={isRepeatOrder}>
                  {uniqueCompany?.map((company) => (
                    <Option key={company.company} value={company.company}>
                      {company.company}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Divider orientation="left">Order Details</Divider>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="p-3 border text-left">Product Name</th>
                      <th className="p-3 border text-center">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((orderDetail: orderDetail, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 border">{orderDetail?.productname}</td>
                        <td className="p-3 border text-center">
                          <Tag color="blue">{orderDetail?.quantity}</Tag>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <Form.Item
                name="companyname"
                label={<Text strong>Company Name</Text>}
                rules={[{ required: true, message: "Select a company" }]}
              >
                <Select
                  size="large"
                  showSearch
                  placeholder="Select a company"
                  value={selectedCompany}
                  onChange={(value) => setSelectedCompany(value)}
                >
                  {uniqueCompany?.map((company) => (
                    <Option key={company.company} value={company.company}>
                      {company.company}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {showProductsTable.length > 0 && (
                <Form.Item
                  label={<Text strong>Order Products</Text>}
                  name={["orderdetail", "productname"]}
                  rules={[{ required: true, message: "Add at least one product" }]}
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="p-3 border text-center">S.No</th>
                          <th className="p-3 border text-left">Product</th>
                          <th className="p-3 border text-center">Stock</th>
                          <th className="p-3 border text-center">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showProductsTable.map((product, index) => {
                          const stockQuantity = products?.find(
                            (p: { productsname: string }) => p.productsname === product
                          )?.quantity || 0;
                          
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3 border text-center">{index + 1}</td>
                              <td className="p-3 border">{product}</td>
                              <td className="p-3 border text-center">
                                <Tag color={stockQuantity < 100 ? "red" : stockQuantity < 300 ? "orange" : "green"}>
                                  {stockQuantity}
                                </Tag>
                              </td>
                              <td className="p-3 border text-center">
                                <InputNumber
                                  name="quantity"
                                  min={0}
                                  size="large"
                                  max={stockQuantity}
                                  placeholder="0"
                                  value={selectedProducts[index]?.quantity || 0}
                                  onChange={(value) => {
                                    const newProducts = [...selectedProducts];
                                    if (newProducts[index]) {
                                      newProducts[index].quantity = value || 0;
                                    } else {
                                      newProducts[index] = {
                                        productname: product,
                                        quantity: value || 0,
                                      };
                                    }
                                    setSelectedProducts(newProducts);
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Form.Item>
              )}

              {visibleProduct && (
                <Form.List name="orderValues">
                  {(fields, { add, remove }) => (
                    <>
                      <Divider orientation="left">Additional Products</Divider>
                      {fields.map(({ key, name }) => {
                        const currentProductName = selectedProducts[showProductsTable.length + key]?.productname;
                        const stockQuantity = products?.find(
                          (p: { productsname: string }) => p.productsname === currentProductName
                        )?.quantity || 0;

                        return (
                          <Card key={key} size="small" className="mb-3">
                            <Space align="baseline" className="w-full" wrap>
                              <Form.Item
                                name={[name, "productname"]}
                                rules={[{ required: true, message: "Select a product" }]}
                                className="mb-0 flex-1"
                                style={{ minWidth: '200px' }}
                              >
                                <Select
                                  size="large"
                                  placeholder="Select product"
                                  onChange={(value) => handleProductChange(value, key)}
                                  style={{ width: '200px' }}
                                >
                                  {products
                                    ?.filter((p: { productsname: string }) =>
                                      !showProductsTable.some((sp) => sp === p.productsname)
                                    )
                                    .map((p: { productsname: string }) => (
                                      <Option key={p.productsname} value={p.productsname}>
                                        {p.productsname}
                                      </Option>
                                    ))}
                                </Select>
                              </Form.Item>
                              
                              {currentProductName && (
                                <Text type="secondary">
                                  Stock: <Tag color={stockQuantity < 100 ? "red" : "green"}>{stockQuantity}</Tag>
                                </Text>
                              )}
                              
                              <Form.Item
                                name={[name, "quantity"]}
                                rules={[
                                  { required: true, message: "Enter quantity" },
                                  {
                                    validator: (_, value) => {
                                      if (value && value > stockQuantity) {
                                        return Promise.reject(`Max quantity is ${stockQuantity}`);
                                      }
                                      return Promise.resolve();
                                    },
                                  },
                                ]}
                                className="mb-0"
                              >
                                <InputNumber
                                  size="large"
                                  placeholder="Quantity"
                                  min={1}
                                  max={stockQuantity}
                                  style={{ width: '100px' }}
                                />
                              </Form.Item>
                              <Button
                                type="primary"
                                danger
                                icon={<MinusCircleOutlined />}
                                onClick={() => {
                                  remove(key);
                                  removeIndex(key);
                                }
                                }
                              />
                            </Space>
                          </Card>
                        );
                      }
                     
                      )}
                    </>
                  )}  
                </Form.List>
              )}              
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};  
export default Orderlist;