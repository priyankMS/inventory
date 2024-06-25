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
  } = useGetAllOrderlistQuery({}, { refetchOnMountOrArgChange: true });
  const {
    data: products,
    isLoading: productLoading,
    refetch: refetchProducts,
  } = useGetAllProductsQuery({}, { refetchOnMountOrArgChange: true });
  const {
    data: company,
    isLoading: companyLoading,
    refetch: refetchCompanies,
  } = useGetAllCompanyQuery({}, { refetchOnMountOrArgChange: true });

  const totalCompany = company?.length || 0;
  const totalOrderQuantity = orders?.length || 0;

  const [lowStockProduct, setLowStockProduct] = useState<ProductInterface[]>([]);
  const screen = useBreakpoint();
  const [selectedDate, setSelectedDate] = useState<string[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<state>({ startDate: "", endDate: "" });

  useEffect(() => {
    if (products) {
      const lowStockProducts = products.filter(product => product.quantity < 500);
      setLowStockProduct(lowStockProducts);
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

  const stripTime = (date: string) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  

  useEffect(() => {
    if (selectedDate && products) {
      const [startDate, endDate] = selectedDate;
      const filteredProducts = products.filter(product => {
        const updatedAt = stripTime(product.updatedAt);
        return updatedAt >= stripTime(startDate) && updatedAt <= stripTime(endDate);
      });
      setLowStockProduct(filteredProducts);
    }
  }, [selectedDate, products]);

  const handleChange = useCallback(
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setState(prevState => ({ ...prevState, [name]: value }));
    },
    []
  );

  const handleOpenChange = () => setOpen(prevOpen => !prevOpen);

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
      const lowStockProducts = products.filter(product => product.quantity < 500);
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
      const searchProduct = products?.filter(product =>
        product.description.toLowerCase().includes(value.toLowerCase())
      );
      setLowStockProduct(searchProduct);
    } else {
      if (products) {
        const lowStockProducts = products.filter(product => product.quantity < 500);
        setLowStockProduct(lowStockProducts);
      }
    }
  };

  if (orderLoading || productLoading || companyLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spin size="large" />
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
      sorter: (a: lowStockProduct, b: lowStockProduct) => a.quantity - b.quantity,
      sortDirections: ["descend" as const, "ascend" as const],
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
    <div className="dark:bg-gray-500 max-h-screen dark:border-gray-200 dark:text-white h-full overflow-hidden flex flex-col w-full xl:gap-10">
      <div className="flex flex-col lg:flex-row justify-between items-center p-4">
        <Space
          direction="horizontal"
          className="grid grid-cols-2 sm:grid-cols-2 lg:flex gap-4"
          size="middle"
          wrap
        >
          <DashboardShow
            title="Products"
            value={products?.length}
            icon={<ShoppingCartOutlined className="text-2xl md:text-3xl xl:text-4xl" />}
            bgColor="bg-green-100"
          />
          <DashboardShow
            title="Order"
            value={totalOrderQuantity}
            icon={<FileDoneOutlined className="text-2xl md:text-3xl xl:text-4xl" />}
            bgColor="bg-blue-100"
          />
          <DashboardShow
            title="Company"
            value={totalCompany}
            icon={<SiHomeassistantcommunitystore className="text-2xl md:text-3xl xl:text-4xl" />}
            bgColor="bg-indigo-100"
          />
          <DashboardShow
            title="Products Under 500"
            value={lowStockProduct.length}
            icon={<FallOutlined className="text-2xl md:text-3xl xl:text-4xl" />}
            bgColor="bg-teal-100"
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
            content={content}
            trigger="click"
            placement="bottomRight"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <FaFilter cursor="pointer" className="text-2xl text-gray-700 dark:text-gray-200" />
          </Popover>
        </Space>
      </div>
      <div className="md:flex-row flex flex-col gap-5">
        <div className="md:w-[60%]">
          {screen.md ? (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              rowClassName="bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white hover:bg-gray-100"
              scroll={{ y: "calc(100vh - 300px)" }}
              sortDirections={["descend", "ascend"]}
              sticky
            />
          ) : (
            <div className="overflow-y-auto mt-10  h-[500px] space-y-4">
              {lowStockProduct.map(product => (
                <Card
                  key={product._id}
                  className="bg-white rounded-lg shadow-md dark:bg-gray-700 p-4"
                  bordered={false}
                  style={{ width: 300 }}
                >
                  <div className="mb-2">
                  <b>Quantity: {product.quantity}</b>
                  </div>
                <div className="mb-2">  <b>Product Name: </b>{product.productsname}</div>
                 <div className=" mb-2"> <b>Update Date: </b>{product.updatedAt?.slice(0, 10)}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className=" hidden md:block">
          <p>Order product by company</p>
          <DashboardChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
