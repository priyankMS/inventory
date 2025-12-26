import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  Space,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Grid,
  Popover,
  Col,
  Row,
  Tooltip,
  Table,
  Tag,
  Typography,
  Badge,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  ShopOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useGetAllProductsQuery } from "../services/Productlist";
import {
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useGetAllCompanyQuery,
  useGetCompanyBypaginationQuery,
  useUpdateCompanyMutation,
} from "../services/Company";
import { companyDetails } from "../interface/companyInterface";
import { FaFilter } from "react-icons/fa";
import DateShow from "./date/DateShow";
import { DateRange, state } from "../interface/orderlistInterface";
import {
  ProductInterface,
  productSearchInterface,
} from "../interface/ProuductInerface";

const { Option } = Select;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;
const { confirm } = Modal;

const Company = () => {
  const { data, isLoading, error, refetch } = useGetAllCompanyQuery({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
  });
  const { data: companyData } = useGetCompanyBypaginationQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const [createCompany] = useCreateCompanyMutation();
  const [editCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();
  const [selectedDate, setSelectedDate] = useState<string[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");

  const [state, setState] = useState<state>({
    startDate: "",
    endDate: "",
  });

  const { data: products, isLoading: productLoading } = useGetAllProductsQuery({
    page: 0,
    limit: 0,
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>();
  const [createCompanyModalVisible, setCreateCompanyModalVisible] = useState<boolean>(false);
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const [allCompanyData, setAllCompanyData] = useState<companyDetails[]>([]);
  const [totalpages, setTotalPages] = useState<number>(0);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  useEffect(() => {
    if (companyData) {
      setAllCompanyData(companyData);
    }
  }, [companyData]);

  const handleCreateCompanyModal = () => {
    form.resetFields();
    setIsEdit(false);
    setCreateCompanyModalVisible(true);
  };

  const handleCreateCompanyCancel = () => {
    form.resetFields();
    setCreateCompanyModalVisible(false);
    setIsEdit(false);
  };

  const handleEditModal = useCallback(
    (record: companyDetails) => {
      setSelected(record._id);
      form.setFieldsValue(record);
      setIsEdit(true);
      setCreateCompanyModalVisible(true);
    },
    [form]
  );

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Company",
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: "Are you sure you want to delete this company? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteCompany(id);
          message.success("Company deleted successfully!");
          refetch();
        } catch (error) {
          message.error("Failed to delete company!");
        }
      },
    });
  };

  const handleCreateCompany = async () => {
    try {
      const values = await form.validateFields();

      const existingCompany = data?.find(
        (company: companyDetails) => company.company === values.company
      );
      if (existingCompany) {
        message.error("Company name already exists");
        return;
      }

      const date = new Date();
      values.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      await createCompany(values).unwrap();
      message.success("Company created successfully!");
      setCreateCompanyModalVisible(false);
      form.resetFields();
      await refetch();
    } catch (error: any) {
      message.error(`Failed to add company: ${error.data?.message || error.message}`);
    }
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();

      const existingCompany = data?.find(
        (company: companyDetails) =>
          company.company === values.company && company._id !== selected
      );
      if (existingCompany) {
        message.error("Company name already exists");
        return;
      }

      await editCompany({ id: selected, updatedCompany: values });
      message.success("Company updated successfully!");
      setCreateCompanyModalVisible(false);
      form.resetFields();
      setIsEdit(false);
      await refetch();
    } catch (error: any) {
      message.error(`Failed to edit company: ${error.data?.message || error.message}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value) {
      setIsSearch(false);
      setAllCompanyData(companyData);
    } else {
      const regex = new RegExp(value, "i");
      const filteredData = data.filter((company: productSearchInterface) => {
        return (
          regex.test(company.company) ||
          company.products.some((product) => regex.test(product))
        );
      });
      setAllCompanyData(filteredData);
      setTotalPages(filteredData?.length);
      setIsSearch(true);
    }
  };

  const stripTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  useEffect(() => {
    if (selectedDate) {
      const startDate = stripTime(new Date(selectedDate[0]));
      const endDate = stripTime(new Date(selectedDate[1]));
      const filteredData = data.filter((company: companyDetails) => {
        const itemDate = stripTime(new Date(company.date));
        return itemDate >= startDate && itemDate <= endDate;
      });
      setAllCompanyData(filteredData);
    } else if (!isSearch) {
      setAllCompanyData(companyData);
    }
  }, [selectedDate, data, companyData, isSearch]);

  const handleChange = useCallback(
    (name: string) => (e: React.FormEvent<HTMLInputElement>) => {
      const value = (e.target as HTMLInputElement)?.value ?? e;
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
    setSearchValue("");
    setIsSearch(false);
    setAllCompanyData(companyData);
  };

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
    [chartFilterInput, handleChange, handleSubmitDates, handleReset]
  );

  const getProductQuantity = (productName: string) => {
    const product = products?.find(
      (prod: { productsname: string; quantity: number }) =>
        prod.productsname === productName
    );
    return product ? product.quantity : 0;
  };

  const getQuantityColor = (quantity: number) => {
    if (quantity < 100) return "red";
    if (quantity < 300) return "orange";
    if (quantity < 500) return "gold";
    return "green";
  };

  const columns = [
    {
      title: "No",
      width: 80,
      dataIndex: "_id",
      render: (_, __, index) => (
        <Badge 
          count={index + 1} 
          style={{ backgroundColor: '#1890ff' }}
        />
      ),
      key: "_id",
      align: "center" as const,
    },
    {
      title: "Company Name",
      dataIndex: "company",
      key: "companyname",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <ShopOutlined className="text-blue-500" />
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products: string[]) => (
        <div className="flex flex-wrap gap-2">
          {products.map((tag: string) => {
            const quantity = getProductQuantity(tag);
            const color = getQuantityColor(quantity);
            return (
              <Tooltip key={tag} title={`Quantity: ${quantity}`}>
                <Tag color={color} className="text-sm font-medium px-3 py-1">
                  {tag.toUpperCase()}
                </Tag>
              </Tooltip>
            );
          })}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-gray-400" />
          <Text>{new Date(date).toLocaleDateString()}</Text>
        </div>
      ),
      width: 150,
      align: "center" as const,
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      fixed: 'right' as const,
      render: (_, record: companyDetails) => (
        <Space size="small">
          <Tooltip title="Edit Company">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditModal(record)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Company">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
      align: "center" as const,
    },
  ];

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({
      page,
      limit: pageSize,
    });
  };

  useLayoutEffect(() => {
    if (!isSearch) {
      const totalData = selectedDate ? allCompanyData.length : data?.length;
      setTotalPages(totalData);
    }
  }, [isSearch, selectedDate, allCompanyData?.length, data?.length]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Space direction="vertical" align="center" size="large">
          <Spin size="large" />
          <Text className="text-gray-600 dark:text-gray-400">Loading companies...</Text>
        </Space>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Text type="danger">Error loading companies</Text>
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
              <ShopOutlined className="text-blue-500" />
              Companies
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">
              Total: {totalpages || 0}
            </Text>
          </Col>
          
          <Col xs={24} md={11}>
            <Input
              size="large"
              placeholder="Search by company or product name..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="shadow-sm"
            />
          </Col>
          
          <Col xs={24} md={5} className="flex justify-end">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateCompanyModal}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 shadow-md"
            >
              Add Company
            </Button>
          </Col>

          <Col xs={24} md={2} className="flex justify-end">
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
            dataSource={allCompanyData}
            rowKey="_id"
            loading={isLoading}
            scroll={{ x: 1200 }}
            rowClassName={(record, index) =>
              index % 2 === 0
                ? "bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                : "bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
            }
            pagination={{
              pageSize: pagination.limit,
              current: pagination.page,
              total: totalpages,
              showSizeChanger: true,
              showTotal: (total, range) => (
                <Text className="dark:text-gray-400">
                  Showing {range[0]}-{range[1]} of {total} companies
                </Text>
              ),
              pageSizeOptions: ["5", "10", "15", "20", "50"],
              onChange: handlePaginationChange,
            }}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {allCompanyData?.length > 0 ? (
            allCompanyData?.map((item: companyDetails, index: number) => (
              <Card
                key={item._id}
                className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge 
                      count={index + 1} 
                      style={{ backgroundColor: '#1890ff' }}
                    />
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <CalendarOutlined />
                      <Text type="secondary">{item.date.slice(0, 10)}</Text>
                    </div>
                  </div>
                  
                  <div>
                    <Text type="secondary" className="text-xs">Company Name</Text>
                    <Title level={5} className="!mb-0 !mt-1 flex items-center gap-2">
                      <ShopOutlined className="text-blue-500" />
                      {item.company}
                    </Title>
                  </div>
                  
                  <div>
                    <Text type="secondary" className="text-xs block mb-2">Products</Text>
                    <div className="flex flex-wrap gap-2">
                      {item.products.map((product: string) => {
                        const quantity = getProductQuantity(product);
                        const color = getQuantityColor(quantity);
                        return (
                          <Tag key={product} color={color} className="text-xs px-2 py-1">
                            {product.toUpperCase()}
                          </Tag>
                        );
                      })}
                    </div>
                  </div>
                  
                  <Space size="small" className="w-full mt-4" direction="horizontal">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEditModal(item)}
                      className="flex-1 bg-blue-500"
                      block
                    >
                      Edit
                    </Button>
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(item._id)}
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
                No companies found
              </Text>
            </Card>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        title={
          <Space className="text-lg">
            <ShopOutlined className="text-blue-500" />
            <Text strong>{isEdit ? "Edit Company" : "Create New Company"}</Text>
          </Space>
        }
        open={createCompanyModalVisible}
        onCancel={handleCreateCompanyCancel}
        onOk={isEdit ? handleEdit : handleCreateCompany}
        okText={isEdit ? "Update" : "Create"}
        cancelText="Cancel"
        width={screens.xs ? "95%" : 600}
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
          className="mt-6"
        >
          <Form.Item
            label={<Text strong>Company Name</Text>}
            name="company"
            rules={[
              { required: true, message: "Please enter company name!" },
              { min: 2, message: "Company name must be at least 2 characters" }
            ]}
          >
            <Input
              size="large"
              placeholder="Enter company name"
              prefix={<ShopOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>Products</Text>}
            name="products"
            rules={[
              { required: true, message: "Please select at least one product!", type: "array" },
            ]}
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Select products"
              loading={productLoading}
              showSearch
              filterOption={(input, option) =>
                (option?.children as string).toLowerCase().includes(input.toLowerCase())
              }
              maxTagCount="responsive"
            >
              {products?.map((product: ProductInterface) => (
                <Option key={product.productsname} value={product.productsname}>
                  {product.productsname}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Company;