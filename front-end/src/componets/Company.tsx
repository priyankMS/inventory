import React, { useState, useCallback, useEffect, useMemo } from "react";
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
  TableColumnsType,
} from "antd";
import { DeleteOutlined, DeleteRowOutlined } from "@ant-design/icons";
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

import { MdDelete } from "react-icons/md";

const { Option } = Select;
const { useBreakpoint } = Grid;

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
  console.log("companyData", companyData);

  const [createCompany] = useCreateCompanyMutation();
  const [editCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();
  const [selectedDate, setSelectedDate] = useState<string[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<state>({
    startDate: "",
    endDate: "",
  });

  const { data: products, isLoading: productLoading } = useGetAllProductsQuery(
    {}
  );
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>();
  const [createCompanyModalVisible, setCreateCompanyModalVisible] =
    useState<boolean>(false);
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const [allCompanyData, setAllCompanyData] = useState<companyDetails[]>([]);

  const { confirm } = Modal;
  console.log("allCompanyData", allCompanyData);

  useEffect(() => {
    if (companyData) {
      setAllCompanyData(companyData);
    }
  }, [companyData]);

  const handleCreateCompanyModal = () => {
    setCreateCompanyModalVisible(true);
  };

  const handleCreateCompanyCancel = () => {
    form.resetFields();
    setCreateCompanyModalVisible(false);
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
      title: "Are you sure you want to delete this company?",
      onOk: async () => {
        try {
          await deleteCompany(id);
          message.success("Product deleted successfully!");
          refetch();
        } catch (error) {
          message.error("Failed to delete product!");
        }
      },
      onCancel() {},
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
      values.date = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      await createCompany(values).unwrap();
      message.success("Company details added");
      setCreateCompanyModalVisible(false);
      form.resetFields();
      await refetch();
    } catch (error: any) {
      message.error(
        `Failed to add company: ${error.data?.message || error.message}`
      );
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
      setCreateCompanyModalVisible(false);
      form.resetFields();
      setIsEdit(false);
      await refetch();
    } catch (error: any) {
      message.error(
        `Failed to edit company: ${error.data?.message || error.message}`
      );
    }
  };

  const handleSearch = (value: string) => {
    if (!value) {
      setAllCompanyData(data);
    } else {
      const regex = new RegExp(value, "i");
      const filteredData = data.filter((company: productSearchInterface) => {
        return (
          regex.test(company.company) ||
          company.products.some((product) => regex.test(product))
        );
      });
      setAllCompanyData(filteredData);
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
      const filteredData = data.filter((company) => {
        const itemDate = stripTime(new Date(company.date));
        return itemDate >= startDate && itemDate <= endDate;
      });
      setAllCompanyData(filteredData);
    } else {
      setAllCompanyData(data);
    }
  }, [selectedDate, data]);

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
  };

  const chartFilterInput = useMemo(() => {
    const { startDate, endDate } = state;

    const input: DateRange[] = [
      {
        name: "startDate",
        label: "From Date(MM/DD/YYYY)",
        placeholder: "MM/DD/YYYY",
        disableDates: "FUTURE",
        value: startDate,
        // error: error.startDate,
      },
      {
        name: "endDate",
        label: "To Date (MM/DD/YYYY)",
        placeholder: "MM/DD/YYYY",
        disableDates: "FUTURE",
        value: endDate,
        // error: error.endDate,
      },
    ];
    return input;
  }, [state]);

  const content = useMemo(
    () => (
      <Col className="p-2  w-52 ">
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
    [chartFilterInput, handleChange, handleSubmitDates]
  );

  console.log("products", products);
  console.log("data", data);

  const getProductQuantity = (productName: string) => {
    const product = products.find((prod) => prod.productsname === productName);
    return product ? product.quantity : 0;
  };

  const columns: TableColumnsType = [
    {
      title: "No",
      width: 50,

      dataIndex: "_id",
      render: (_, __, index) => index + 1,
      key: "_id",
      className: "text-center",
    },
    {
      title: "Company Name",
      dataIndex: "company",
      key: "companyname",
      align: "center",
      className: "text-center",
    },
    {
      title: "Product",
      dataIndex: "products",
      key: "products",
      align: "center",
      render: (products) => (
        <div className="flex flex-wrap justify-center">
          {products.map((tag) => {
            const quantity = getProductQuantity(tag);
            const color =
              quantity < 100 ? "red" : quantity < 200 ? "orange" : "green";
            return (
              <Tag color={color} className="m-1" key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => new Date(date).toLocaleDateString(),
      align: "center",
      className: "text-center",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle" align="center" className="flex justify-center">
          <Tooltip title="Edit">
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white rounded"
              icon={<DeleteRowOutlined />}
              onClick={() => handleEditModal(record)}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              className="bg-red-500 hover:bg-red-700 text-white rounded"
              icon={<MdDelete />}
              onClick={() => handleDelete(record._id)}
            >
              Delete
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({
      page,
      limit: pageSize,
    });
  };

  const totalPage = useMemo(() => {
    const totalData = selectedDate ? allCompanyData.length : data?.length;
    return totalData;
  }, [allCompanyData, selectedDate, data]);

  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-700"></div>
      </div>
    );
  if (error) return <p>Error: {"data" in error}</p>;

  return (
    <div className="dark:bg-gray-700  dark:border-gray-600 dark:text-white h-full overflow-hidden w-full lg:p-4">
      <div className="flex justify-between lg:p-2 items-center mb-4 max-md:flex max-md:flex-col md:flex md:justify-around">
        <h2 className="dark:text-white max-md:w-full font-serif   md:text-xl ">
          Company
        </h2>

        <Input
          type="text"
          id="small-input"
          placeholder="Search Company Name or Product Name"
          onChange={(e) => handleSearch(e.target.value)}
          className="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-md:w-full max-md:pl-4 md:w-72"
        />
        <Button
          type="primary"
          onClick={handleCreateCompanyModal}
          className="max-md:w-full max-md:mt-3 max-md:mb-4 max-md:pl-10 max-md:pr-10"
        >
          Add company
        </Button>

        <Popover
          content={content}
          trigger="click"
          placement="bottomRight"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <FaFilter cursor="pointer" />
        </Popover>
      </div>

      {screens.md ? (
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <Table
            sticky
            scroll={{ y: 270, scrollToFirstRowOnChange: true }}
            //  className="min-w-full  divide-gray-200"
            pagination={{
              pageSize: pagination.limit,
              total: totalPage,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              defaultPageSize: 5,
              onShowSizeChange: (page, pageSize) => {
                handlePaginationChange(page, pageSize);
              },
              pageSizeOptions: ["5", "10", "15", "20"],
            }}
            columns={columns}
            dataSource={allCompanyData}
          />
        </div>
      ) : (
        <div
          className="overflow-y-auto   space-y-4"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          {allCompanyData?.map((item: companyDetails) => (
            <Card
              key={item._id}
              className="bg-white rounded-lg shadow-md dark:bg-gray-700 p-4"
            >
              <div className="mb-2">
                <b>Company Name:</b> {item.company}
              </div>
              <div className="mb-2">
                <b className="tracking-wide">Products Name:</b>{" "}
                {item.products.join(", ")}
              </div>
              <div className="mb-2">
                <b>Date:</b> {item.date.slice(0, 10)}
              </div>
              <div className="flex justify-between">
                <Space size="middle">
                  <Button type="primary" onClick={() => handleEditModal(item)}>
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </Space>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Create Company"
        open={createCompanyModalVisible}
        onCancel={handleCreateCompanyCancel}
        onOk={isEdit ? handleEdit : handleCreateCompany}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Company Name"
            name="company"
            rules={[
              { required: true, message: "Please input the company name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"products"}
            rules={[
              { required: true, message: "Select a product", type: "array" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select product"
              loading={productLoading}
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
