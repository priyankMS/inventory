import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useGetAllOrderlistQuery } from "../services/Orderlist";
import { useGetAllProductsQuery } from "../services/Productlist";
import { useGetAllCompanyQuery } from "../services/Company";
import {
  Button,
  Card,
  Col,
  Grid,
  Input,
  Popover,
  Row,
  Space,
  Spin,
  Table,
  Typography,
  Badge,
  Statistic,
} from "antd";
import {
  FallOutlined,
  FileDoneOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import DashboardShow from "./ui/DashboardShow";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import DashboardChart from "./ui/DashboardChart";
import { FaFilter } from "react-icons/fa";
import DateShow from "./date/DateShow";
import { ProductInterface } from "../interface/ProuductInerface";
import { DateRange, state } from "../interface/orderlistInterface";
import { lowStockProduct } from "../interface/dashboardInterFace";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const {
    data: orders,
    isLoading: orderLoading,
    refetch: refetchOrders,
  } = useGetAllOrderlistQuery(
    {
      page: 0,
      limit: 0,
    },
    { refetchOnMountOrArgChange: true }
  );
  
  const {
    data: products,
    isLoading: productLoading,
    refetch: refetchProducts,
  } = useGetAllProductsQuery(
    {
      page: 0,
      limit: 0,
    },
    { refetchOnMountOrArgChange: true }
  );
  
  const {
    data: company,
    isLoading: companyLoading,
    refetch: refetchCompanies,
  } = useGetAllCompanyQuery({}, { refetchOnMountOrArgChange: true });

  const [lowStockProduct, setLowStockProduct] = useState<ProductInterface[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductInterface[]>([]);
  const screen = useBreakpoint();
  const [selectedDate, setSelectedDate] = useState<string[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<state>({ startDate: "", endDate: "" });
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (products) {
      const lowStockProducts = products.filter(
        (product:any) => product.quantity < 500
      );
      setLowStockProduct(lowStockProducts);
      setFilteredProducts(lowStockProducts);
    }
  }, [products]);

  const memoizedRefetchOrders = useCallback(refetchOrders, [refetchOrders]);
  const memoizedRefetchProducts = useCallback(refetchProducts, [refetchProducts]);
  const memoizedRefetchCompanies = useCallback(refetchCompanies, [refetchCompanies]);

  useEffect(() => {
    memoizedRefetchOrders();
    memoizedRefetchProducts();
    memoizedRefetchCompanies();
  }, [memoizedRefetchOrders, memoizedRefetchProducts, memoizedRefetchCompanies]);

  const stripTime = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  useEffect(() => {
    let result = [...lowStockProduct];

    // Apply search filter
    if (searchValue) {
      result = result.filter((product) =>
        product.productsname.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply date filter
    if (selectedDate) {
      const startDate = stripTime(new Date(selectedDate[0]));
      const endDate = stripTime(new Date(selectedDate[1]));
      result = result.filter((product) => {
        const updatedAt = stripTime(new Date(product.updatedAt));
        return updatedAt >= startDate && updatedAt <= endDate;
      });
    }

    setFilteredProducts(result);
  }, [lowStockProduct, selectedDate, searchValue]);

  const handleChange = useCallback(
    (name: string) => (e: React.FormEvent<HTMLInputElement>) => {
      const value = (e.target as HTMLInputElement)?.value ?? e;
      setState((prevState) => ({ ...prevState, [name]: value }));
    },
    []
  );

  const handleOpenChange = () => setOpen((prevOpen) => !prevOpen);

  const handleSubmitDates = useCallback(() => {
    const { startDate, endDate } = state;
    if (startDate && endDate) {
      setSelectedDate([startDate, endDate]);
      setOpen(false);
    }
  }, [state]);

  const handleReset = useCallback(() => {
    setState({ startDate: "", endDate: "" });
    setSelectedDate(null);
    setSearchValue("");
    if (products) {
      const lowStockProducts = products.filter(
        (product:any) => product.quantity < 500
      );
      setLowStockProduct(lowStockProducts);
      setFilteredProducts(lowStockProducts);
    }
  }, [products]);

  const chartFilterInput = useMemo(() => {
    const { startDate, endDate } = state;
    const input: DateRange[] = [
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
    return input;
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
            <Button 
              block 
              size="large"
              onClick={handleReset}
              icon={<ReloadOutlined />}
            >
              Reset
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              block 
              type="primary" 
              size="large"
              onClick={handleSubmitDates}
            >
              Apply
            </Button>
          </Col>
        </Row>
      </div>
    ),
    [chartFilterInput, handleChange, handleReset, handleSubmitDates]
  );

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const isLoading = orderLoading || productLoading || companyLoading;

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Space direction="vertical" align="center" size="large">
          <Spin size="large" />
          <Text className="text-gray-600 dark:text-gray-400">Loading dashboard...</Text>
        </Space>
      </div>
    );
  }

  const columns = [
    { 
      title: "No", 
      dataIndex: "no", 
      width: 70, 
      key: "no",
      fixed: 'left' as const,
    },
    {
      title: "Product Name",
      dataIndex: "productsname",
      key: "productsname",
      ellipsis: true,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      sorter: (a: lowStockProduct, b: lowStockProduct) => a.quantity - b.quantity,
      sortDirections: ["descend" as const, "ascend" as const],
      defaultSortOrder: "ascend" as const,
      render: (quantity: number) => (
        <Badge 
          count={quantity} 
          showZero 
          color={quantity < 100 ? "red" : quantity < 300 ? "orange" : "green"}
          style={{ fontSize: '14px', fontWeight: 'bold' }}
        />
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 130,
    },
  ];

  const dataSource = filteredProducts?.map((product, index) => ({
    key: product._id,
    no: index + 1,
    productsname: product.productsname,
    quantity: product.quantity,
    updatedAt: product.updatedAt?.slice(0, 10),
  })) as readonly lowStockProduct[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="!mb-2 dark:text-white">
          Dashboard Overview
        </Title>
        <Text className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your inventory today.
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl"
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span className="text-gray-600 dark:text-gray-400 font-medium">Total Products</span>}
              value={products?.length || 0}
              prefix={<ShoppingCartOutlined className="text-green-500" />}
              valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl"
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span className="text-gray-600 dark:text-gray-400 font-medium">Total Orders</span>}
              value={orders?.length || 0}
              prefix={<FileDoneOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6', fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl"
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span className="text-gray-600 dark:text-gray-400 font-medium">Companies</span>}
              value={company?.length || 0}
              prefix={<SiHomeassistantcommunitystore className="text-indigo-500" />}
              valueStyle={{ color: '#6366f1', fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl"
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span className="text-gray-600 dark:text-gray-400 font-medium">Low Stock Alert</span>}
              value={lowStockProduct?.length || 0}
              prefix={<FallOutlined className="text-orange-500" />}
              valueStyle={{ color: '#f97316', fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            className="shadow-lg border-0 rounded-xl"
            title={
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Title level={4} className="!mb-0 dark:text-white">
                  Low Stock Products ({filteredProducts?.length})
                </Title>
                <Space size="middle">
                  <Input
                    placeholder="Search products..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 250 }}
                    size="large"
                    allowClear
                  />
                  <Popover
                    placement="bottomRight"
                    content={content}
                    trigger="click"
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
                </Space>
              </div>
            }
          >
            {screen.md ? (
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{
                  pageSize: 8,
                  total: filteredProducts?.length,
                  showTotal: (total, range) => (
                    <Text className="dark:text-gray-400">
                      Showing {range[0]}-{range[1]} of {total} products
                    </Text>
                  ),
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '8', '10', '20'],
                }}
                rowClassName={(record, index) =>
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                    : "bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                }
                scroll={{ x: 800 }}
                sortDirections={["descend", "ascend"]}
              />
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <Card
                      key={product._id}
                      className="shadow-md hover:shadow-lg transition-shadow rounded-lg border border-gray-200 dark:border-gray-700"
                      bodyStyle={{ padding: '16px' }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <Badge 
                          count={index + 1} 
                          style={{ backgroundColor: '#3b82f6' }}
                        />
                        <Badge 
                          count={product.quantity} 
                          color={product.quantity < 100 ? "red" : product.quantity < 300 ? "orange" : "green"}
                        />
                      </div>
                      <Title level={5} className="!mb-2 dark:text-white">
                        {product.productsname}
                      </Title>
                      <Text className="text-gray-500 dark:text-gray-400 text-sm">
                        Updated: {product.updatedAt?.slice(0, 10)}
                      </Text>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Text className="text-gray-500 dark:text-gray-400">
                      No products found matching your filters
                    </Text>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            className="shadow-lg border-0 rounded-xl h-full"
            title={
              <Title level={4} className="!mb-0 dark:text-white">
                Order Statistics
              </Title>
            }
          >
            <DashboardChart />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;