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
} from "antd";
import type { TableColumnsType } from "antd";

import {
  EyeOutlined,
  UploadOutlined,
  PlusOutlined,
  LoadingOutlined,
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
import "../style/orderlist.css";
dayjs.extend(customParseFormat);
import { FaFilter } from "react-icons/fa";
const { Option } = Select;
const { useBreakpoint } = Grid;

const Orderlist = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
  });

  const { data, isLoading, error, refetch } = useGetAllOrderlistQuery({
    page: pagination.page,
    limit: pagination.limit,
  });
  const { data: totalOrderList, refetch: refetchorder } =
    useGetAllOrderlistQuery({
      page: 0,
      limit: 0,
    });

  const {
    data: products,

    refetch: productRefetch,
  } = useGetAllProductsQuery({
    page:0,
    limit:0
  });

  const { data: company } = useGetAllCompanyQuery({});
  const [createOrderlist] = useCreateOrderlistMutation();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [createOrderModalVisible, setCreateOrderModalVisible] =
    useState<boolean>(false);
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

  useEffect(() => {
    if (data) {
      setAllData(data);
    }
  }, [data]);

  useEffect(() => {
    if (
      selectedProducts.includes(undefined) ||
      selectedProducts.includes(null)
    ) {
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
      const filteredData = totalOrderList?.filter((order:orderListDetails) => {
        const orderDate = stripTime(order.date);
        return (
          orderDate >= stripTime(startDate) && orderDate <= stripTime(endDate)
        );
      });
      setFilteredData(filteredData);
    } else {
      setFilteredData(allData);
    }
  }, [selectedDate, allData, totalOrderList]);
  console.log("filter data ,",filteredData);
  

  const screens = useBreakpoint();
  const [form] = Form.useForm();

  const handleView = useCallback((record: selectorderDetails) => {
    setSelectedOrder(record);
    setModalVisible(true);
  }, []);

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleCreateOrder = useCallback(() => {
    setIsRepeatOrder(false);
    setCreateOrderModalVisible(true);
  }, []);

  const handleRepeatOrder = useCallback(
    (record: repeateOrder) => {
      const newSelectedProducts = record.orderdetail.map(
        (order: orderDetail) => ({
          productname: order.productname,
          quantity: order.quantity,
        })
      );
      setIsRepeatOrder(true);
      setSelectedProducts(newSelectedProducts);
      form.setFieldsValue(record); // Set initial values, including editableQuantity
      setCreateOrderModalVisible(true);
    },
    [form]
  );

  const handleCreateOrderCancel = useCallback(() => {
    setSelectedProducts([]);
    setShowProductsTable([]);

    form.resetFields();
    setCreateOrderModalVisible(false);
    setVisibleProduct(false);
  }, [form]);

  useEffect(() => {
    if (selectedCompany) {
      const selectedCompanyData = company.find(
        (company: companyOrderList) => company.company === selectedCompany
      );
      if (selectedCompanyData) {
        const products = selectedCompanyData.products;
        setSelectedProducts(
          products.map((product: orderDetail) => ({
            productname: product,
            quantity: 0,
          }))
        );
        setShowProductsTable(products);
        setVisibleProduct(true);
      }
    }
  }, [selectedCompany, company]);

  const handleCreateOrderlist = async () => {
    try {
      const values = await form.validateFields();
      const { companyname } = values;

      const updatedProducts = selectedProducts.map((product: orderDetail) => ({
        productname: product.productname,
        quantity: product.quantity,
      }));
      // for (const product of orderdetail) {
      //   const availableProduct = products.find(
      //     (p) => p.productsname === product.productname
      //   );
      // //   if (!availableProduct)
      // //     throw new Error(`No product by ${product.productname} name found`);
      // //   if (availableProduct.quantity < product.quantity) {
      // //     throw new Error(
      // //       `Insufficient quantity for product: ${product.productname}`
      // //     );
      // //   }
      // // }

      // // const orderDetails = orderdetail.map((product) => ({
      // //   productname: product.productname,
      // //   quantity: product.quantity,
      // // }));
      const currentDate = new Date();

      const newOrderlistData = {
        companyname,
        orderdetail: updatedProducts,
        date: `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`,
      };
      await createOrderlist(newOrderlistData).unwrap();
      message.success("Order list created successfully.");
      setCreateOrderModalVisible(false);
      setSelectedProducts([]);

      form.resetFields();
      refetch();
      refetchorder();
      setVisibleProduct(false);
      productRefetch();
    } catch (error) {
      message.error(
        `Failed to create order list: ${error.data?.message || error.message}`
      );
    }
  };

  const uniqueCompany = useMemo(() => {
    return Array.from(
      new Set(company?.map((a: ComapanyOrderList) => a.company))
    ).map((value) => {
      return company.find(
        (company: ComapanyOrderList) => company.company === value
      );
    });
  }, [company]);
  console.log("okey");

  const columns: TableColumnsType = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (_, __, index) => index + 1,
      width: 50,
      className:"text-center"
    },
    {
      title: "Company Name",
      dataIndex: "companyname",
      key: "companyname",
      width: 200,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
      width: 200,
      align: "center",
    },
    {
      title: "Action",
      width: 200,
      className: "flex justify-center items-center",
      key: "action",
      render: (_, record) => (
        <Space size="middle" align="center">
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Upload Image">
            {!record.invoice ? (
              <Upload beforeUpload={(file) => handleUpload(record, file)}>
                <Button icon={<UploadOutlined />} />
              </Upload>
            ) : (
              <Image
                width={50}
                src={`data:image/png;base64,${record.invoice}`}
              />
            )}
          </Tooltip>
          <Tooltip>
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white  rounded"
              icon={<PlusOutlined />}
              onClick={() => handleRepeatOrder(record)}
            >
              Repeat Order
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleUpload = async (record: orderListDetails, file: File) => {
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
    message.success(`${file.name} file uploaded successfully.`);
    await refetch();
    return false;
  };

  const handleChange = useCallback(
    (name: string) => (e: any) => {
      const value = e?.target?.value ?? e;
      setState((prevState: { startDate: string; endDate: string }) => ({
        ...prevState,
        [name]: value,
      }));
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

    const input: DateRange[] = [
      {
        name: "startDate",
        label: "From Date(MM/DD/YYYY)",
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
    setPagination({
      page,
      limit: pageSize,
    });
  };

  const totalPage = useMemo(()=>{
    const totalData =  selectedDate ? filteredData.length : totalOrderList?.length || 0;
    return totalData
  },[filteredData?.length, selectedDate, totalOrderList?.length])


  if (isLoading)
    return (
      <Spin
        className="h-full flex justify-center items-center"
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    );
  if (error) return <p>Error: {"data" in error}</p>;

  return (
    <div className="w-full p-4   h-full overflow-hidden">
      <div className="flex justify-between">
        <h2 className="dark:text-white">Order List</h2>

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
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateOrder}
        className="mb-6"
      >
        Create Order
      </Button>

      {screens.md ? (
        <div className="custom-scrollbar">
          <Table
            className="p-2 self-start"
            columns={columns}
            pagination={{
              pageSize: pagination.limit,
            
              total: totalPage,
              showTotal: (total, range) =>
                ` ${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, pageSize) => {
                handlePaginationChange(page, pageSize);
              },
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "15", "20"],
            }}
            sticky
            rowClassName="bg-white hover:bg-gray-100"
            scroll={{ y: 270, scrollToFirstRowOnChange: true }}
            dataSource={filteredData}
          />
        </div>
      ) : (
        <>
          <div
            className="  overflow-y-auto dark:bg-slate-700"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            {( selectedDate ? filteredData : totalOrderList)?.map((item:orderListDetails) => (
              <Card
                key={item._id}
                className="bg-white rounded-lg shadow-md dark:bg-gray-700   mb-4"
              >
                <div>
                  <b>Company Name:</b> {item.companyname}
                </div>
                <div>
                  <b>Date:</b> {new Date(item.date).toLocaleDateString()}
                </div>
                <div>
                  <b>Action:</b>
                  <div className=" flex flex-col gap-2 p-2">
                    <div className=" flex  justify-around">
                      <Tooltip title="View">
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => handleView(item)}
                        />
                      </Tooltip>
                      <Tooltip
                        title="Upload Image"
                        style={{ height: 32, width: 32 }}
                      >
                        {!item.invoice ? (
                          <Upload
                            beforeUpload={(file) => handleUpload(item, file)}
                          >
                            <Button icon={<UploadOutlined />} />
                          </Upload>
                        ) : (
                          <Image
                            width={50}
                            src={`data:image/png;base64,${item.invoice}`}
                          />
                        )}
                      </Tooltip>
                    </div>
                    <Tooltip>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleRepeatOrder(item)}
                      >
                        Repeat Order
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal
        title="Order Details"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedOrder && (
          <div className="m-0   shadow-lg text-black ">
            <p>Company Name: {selectedOrder.companyname}</p>
            <p>Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
            <p className="text-black text-2xl">Order Details:</p>
            <ul>
              {selectedOrder.orderdetail.map((detail, index: number) => (
                <li key={index}>
                  Product Name: {detail.productname},<br /> Quantity:{" "}
                  {detail.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      <Modal
        title="Create Order"
        open={createOrderModalVisible}
        onCancel={handleCreateOrderCancel}
        onOk={handleCreateOrderlist}
      >
        <Form form={form} layout="vertical">
          {isRepeatOrder ? (
            <Form.Item>
              <Form.Item
                name="companyname"
                label="Company Name"
                rules={[{ required: true, message: "Select a company" }]}
              >
                <Select value={selectedCompany} disabled={isRepeatOrder}>
                  {uniqueCompany?.map((company) => (
                    <Option key={company.company} value={company.company}>
                      {company.company}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="p-2 bg-gray-300">
                    <th className="p-2 border border-gray-300">Product Name</th>
                    <th className="p-2 border border-gray-300">Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedProducts.map(
                    (orderDetail: orderDetail, index: number) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="p-2 border border-gray-300 text-center">
                          {orderDetail?.productname}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          {orderDetail?.quantity}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="companyname"
                label="Company Name"
                rules={[{ required: true, message: "Select a company" }]}
              >
                <Select
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
              <Form.Item
                name={["orderdetail", "productname"]}
                rules={[{ required: true, message: "Select a product" }]}
              >
                {showProductsTable.length > 0 && (
                  <div className="overflow-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="p-2 bg-gray-300">
                          <th className="p-2 border border-gray-300">S.No</th>
                          <th className="p-2 border border-gray-300">
                            Product
                          </th>
                          <th className="p-2 border border-gray-300">Stock</th>
                          <th className="p-2 border border-gray-300">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {showProductsTable.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="p-2 border border-gray-300 text-center">
                              {index + 1}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {product}
                            </td>
                            <td className="p-2 border border-gray-300 text-center">
                              {products.find(
                                (p: { productsname: string }) =>
                                  p.productsname === product
                              )?.quantity || 0}
                            </td>
                            <td className="p-2 border border-gray-300 text-center">
                              <InputNumber
                                name="quantity"
                                min={1}
                                max={
                                  products.find(
                                    (p: { productsname: string }) =>
                                      p.productsname === product
                                  )?.quantity || 0
                                }
                                onChange={(value) => {
                                  const newProducts = [...selectedProducts];
                                  if (newProducts[index]) {
                                    newProducts[index].quantity = value;
                                  } else {
                                    newProducts[index] = {
                                      productname: product,
                                      quantity: value,
                                    };
                                  }
                                  setSelectedProducts(newProducts);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Form.Item>
            </>
          )}

          {visibleProduct && (
            <Form.List name="orderValues">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Space key={key} align="baseline">
                      <Form.Item
                        name={[name, "productname"]}
                        rules={[
                          { required: true, message: "Select a product" },
                        ]}
                      >
                        <Select
                          placeholder="Select product"
                          onChange={(value) => handleProductChange(value, key)}
                        >
                          {products
                            .filter(
                              (p: { productsname: string }) =>
                                !showProductsTable.some(
                                  (sp) => sp === p.productsname
                                )
                            )
                            .map((p: { productsname: string }) => (
                              <Option
                                key={p.productsname}
                                value={p.productsname}
                              >
                                {p.productsname}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                      {selectedProducts.length > showProductsTable.length && (
                        <p>
                          {" "}
                          stock:{" "}
                          {products.find(
                            (p: { productsname: string }) =>
                              p.productsname ===
                              selectedProducts[selectedProducts.length - 1]
                                ?.productname
                          )?.quantity || 0}
                        </p>
                      )}
                      <Form.Item
                        name={[name, "quantity"]}
                        rules={[{ required: true, message: "Enter quantity" }]}
                      >
                        <InputNumber
                          placeholder="Quantity"
                          min={1}
                          max={
                            products.find(
                              (p: { productsname: string }) =>
                                p.productsname ===
                                selectedProducts[selectedProducts.length - 1]
                                  ?.productname
                            )?.quantity || 0
                          }
                          onChange={(value) => {
                            const newProducts = [...selectedProducts];
                            const currentProduct = newProducts.find(
                              (product) =>
                                product.productname ===
                                selectedProducts[selectedProducts.length - 1]
                                  .productname
                            );
                            currentProduct.quantity = value;
                            const index = newProducts.findIndex(
                              (product) =>
                                product.productname ===
                                selectedProducts[selectedProducts.length - 1]
                                  .productname
                            );
                            newProducts[index] = currentProduct;
                            setSelectedProducts(newProducts);
                          }}
                        />
                      </Form.Item>
                      {!isRepeatOrder && (
                        <Button
                          type="link"
                          onClick={() => {
                            remove(name);
                            removeIndex(name);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      block
                    >
                      Add Product
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Orderlist;
