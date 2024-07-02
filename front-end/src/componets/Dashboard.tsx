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
} from "antd";
import {
  FallOutlined,
  FileDoneOutlined,
  ShoppingCartOutlined,
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

  const [lowStockProduct, setLowStockProduct] = useState<ProductInterface[]>(
    []
  );
  const screen = useBreakpoint();
  const [selectedDate, setSelectedDate] = useState<string[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<state>({ startDate: "", endDate: "" });

  useEffect(() => {
    if (products) {
      const lowStockProducts = products.filter(
        (product) => product.quantity < 500
      );
      setLowStockProduct(lowStockProducts);
    }
  }, [products]);

  const memoizedRefetchOrders = useCallback(refetchOrders, [refetchOrders]);
  const memoizedRefetchProducts = useCallback(refetchProducts, [
    refetchProducts,
  ]);
  const memoizedRefetchCompanies = useCallback(refetchCompanies, [
    refetchCompanies,
  ]);

  useEffect(() => {
    memoizedRefetchOrders();
    memoizedRefetchProducts();
    memoizedRefetchCompanies();
  }, [
    memoizedRefetchOrders,
    memoizedRefetchProducts,
    memoizedRefetchCompanies,
  ]);

  const stripTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  useEffect(() => {
    if (selectedDate) {
      const startDate = stripTime(new Date(selectedDate[0]));
      const endDate = stripTime(new Date(selectedDate[1]));
      const filteredData = lowStockProduct.filter((product) => {
        const updatedAt = stripTime(new Date(product.updatedAt));
        return updatedAt >= startDate && updatedAt <= endDate;
      });
      setLowStockProduct(filteredData);
    }
  }, [lowStockProduct, products, selectedDate]);

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
    if (products) {
      const lowStockProducts = products.filter(
        (product) => product.quantity < 500
      );
      setLowStockProduct(lowStockProducts);
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
      <Col className="p-2 w-52">
        {chartFilterInput.map((item, index) => (
          <Col key={index} className="pb-8 mt-2">
            <DateShow
              size="large"
              onChange={handleChange(item.name)}
              disabled={false}
              {...item}
            />
          </Col>
        ))}
        <Row gutter={16}>
          <Col span={12}>
            <Button type="default" onClick={handleReset} size="middle">
              Reset
            </Button>
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={handleSubmitDates} size="middle">
              Submit
            </Button>
          </Col>
        </Row>
      </Col>
    ),
    [chartFilterInput, handleChange, handleReset, handleSubmitDates]
  );

  const handleSearch = (value: string) => {
    if (value) {
      const searchProduct = products?.filter((product) =>
        product.productsname.toLowerCase().includes(value.toLowerCase())
      );
      setLowStockProduct(searchProduct);
    } else {
      if (products) {
        const lowStockProducts = products.filter(
          (product) => product.quantity < 500
        );
        setLowStockProduct(lowStockProducts);
      }
    }
  };

  // Check if any data is still loading
  const isLoading = orderLoading || productLoading || companyLoading;

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spin size="default" />
      </div>
    );
  }

  const columns = [
    { title: "No", dataIndex: "no", width: 80, key: "no" },
    {
      title: "Product Name",
      width: 200,
      dataIndex: "productsname",
      key: "productsname",
    },
    {
      title: "Quantity",
      width: 200,
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a: lowStockProduct, b: lowStockProduct) =>
        a.quantity - b.quantity,
      sortDirections: ["descend" as const, "ascend" as const],
      defaultSortOrder: "descend" as const,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 120,
    },
  ];

  const dataSource = lowStockProduct?.map((product, index) => ({
    key: product._id,
    no: index + 1,
    productsname: product.productsname,
    quantity: product.quantity,
    updatedAt: product.updatedAt?.slice(0, 10),
  })) as readonly lowStockProduct[];
  
  return (
    <div className="dark:bg-gray-900 bg-gray-100 max-h-screen dark:border-gray-200  h-full overflow-hidden flex flex-col w-full xl:gap-5 p-1">
      <div className="flex flex-col lg:flex-row justify-between items-center p-2  dark:bg-gray-800 rounded-lg shadow-md">
        <Space
          direction="horizontal"
          className="grid grid-cols-2 sm:grid-cols-4 lg:flex gap-4"
          size="middle"
          wrap
        >
          <DashboardShow
            title="Products"
            value={products?.length}
            icon={
              <ShoppingCartOutlined className="text-2xl md:text-3xl xl:text-4xl" />
            }
            bgColor="bg-green-300 dark:bg-green-700"
          />
          <DashboardShow
            title="Order"
            value={orders?.length}
            icon={
              <FileDoneOutlined className="text-2xl md:text-3xl xl:text-4xl" />
            }
            bgColor="bg-blue-300 dark:bg-blue-700"
          />
          <DashboardShow
            title="Company"
            value={company?.length}
            icon={
              <SiHomeassistantcommunitystore className="text-2xl md:text-3xl xl:text-4xl" />
            }
            bgColor="bg-indigo-300 dark:bg-indigo-700"
          />
          <DashboardShow
            title="Products Under 500"
            value={lowStockProduct?.length}
            icon={<FallOutlined className="text-2xl md:text-3xl xl:text-4xl" />}
            bgColor="bg-orange-300 dark:bg-orange-700"
          />
        </Space>
        <Space className="flex lg:flex-row gap-4 mt-4 lg:mt-0">
          <Input
            type="text"
            id="small-input"
            placeholder="Search product"
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full lg:w-64 h-10 block text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <Popover
            placement="bottomRight"
            content={content}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <Button
              className="dark:bg-gray-800 dark:border-gray-700"
              icon={<FaFilter />}
            />
          </Popover>
        </Space>
      </div>
      <div className="lg:flex-row -mx5 flex flex-col gap-2">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          {screen.md ? (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{
                pageSize: 5,
                total: lowStockProduct?.length,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              rowClassName={(record, index) =>
                index % 2 === 0
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              } 
              scroll={{ y: 240, scrollToFirstRowOnChange: true }}
              sortDirections={["descend", "ascend"]}
              sticky
            />
          ) : (
            <div className="overflow-y-auto mt-10 h-[500px] space-y-4">
              {lowStockProduct.map((product) => (
                <Card
                  key={product._id}
                  className=" rounded-lg shadow-md dark:bg-gray-700 p-4"
                  bordered={false}
                  style={{ width: 300 }}
                >
                  <div className="mb-2">
                    <b>Quantity: {product.quantity}</b>
                  </div>
                  <div className="mb-2">
                    <b>Product Name: </b>
                    {product.productsname}
                  </div>
                  <div className="mb-2">
                    <b>Update Date: </b>
                    {product.updatedAt?.slice(0, 10)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <Col xs={24} sm={24} md={24} lg={10} xl={10} className="overflow-auto">
          <Card
            title="Order Statistics"
            color="bg-white dark:bg-gray-800 dark:text-white"
            className="p-0 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md"
          >
            <DashboardChart />
          </Card>
        </Col>
      </div>
    </div>
  );
};

export default Dashboard;
