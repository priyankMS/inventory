import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { Button, Modal, Form, Input, InputNumber, message, Card, TableColumnType, Table } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../services/Productlist";
import { useMediaQuery } from "react-responsive";
import { formDataProduct } from "../interface/ProuductInerface";

const { confirm } = Modal;

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
  const [pagination,setPagination]=useState({
    page:1,
    limit:5
  })
  const { data, isLoading, refetch } = useGetAllProductsQuery({
    page:pagination.page,
    limit:pagination.limit
  });
  const [totalpages,setTotalPages]=useState<number>(0)
  const {data:totalProduct,refetch:totalRefetch}=useGetAllProductsQuery({
    page:0,
    limit:0
  })
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [allProduct, setAllProduct] = useState([]);
 
  const isMobile = useMediaQuery({ maxWidth:  786 });


  useEffect(()=>{
    if(data){
      setAllProduct(data)
    }
  
  },[data])

  const handleSearch = (value: string) => {
    if(!value){
      setIsSearch(false)
      setAllProduct(data)
    } else {
      const regex = new  RegExp(value,"i")
      const filteredData = totalProduct?.filter((product:formDataProduct)=>regex.test(product.productsname) || regex.test(product.quantity.toString()))
       setAllProduct(filteredData)
        setIsSearch(true)
        setTotalPages(filteredData?.length)
    }
  }
  



  

  const memoizedRefetch = useCallback(() => { refetch(),totalRefetch();}, [refetch,totalRefetch]);

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
        title: "Are you sure you want to delete this product?",
        icon: <ExclamationCircleOutlined />,
        onOk: async () => {
          try {
            await deleteProduct(id);
            message.success("Product deleted successfully!");
            memoizedRefetch();
          } catch (error) {
            message.error("Failed to delete product!");
          }
        },
        onCancel() {},
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

  

  
  

  const columns:TableColumnType =[
    {
      title:"NO",
      dataIndex:"_id",
      render: (_, __, index:number) => index + 1,
      key:"_id",
      className:"text-center",
      width:80,
      align:"center"
    },
    {
     title:"product Name",
     dataIndex:"productsname",
     key:"productsname",
     align:"center",
     className:"text-center"
    },
    {
      title:" Description",
      dataIndex:"description",
      key:"description",
      align:"center",
      className:"text-center"
    },
    {
      title:"Quantity",
      dataIndex:"quantity",
      key:"quantity",
      align:"center",
      className:"text-center"
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: (_,record:formDataProduct) => (
        <div className="flex justify-center">
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            className="mr-2"
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id!)}
          >
            Delete
          </Button>
        </div>
      ),
    }

  ]

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({
      page,
      limit: pageSize,
    });
  };


  useLayoutEffect(()=>{
    if(!isSearch){
      setTotalPages(totalProduct?.length)
    }
  },[totalProduct,isSearch])

  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-700"></div>
      </div>
    );

  return (
    <div className="w-full h-full p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4 max-md:flex max-md:flex-col md:flex md:justify-around">
        <h3 className="dark:text-white  font-serif max-md:w-full">Product</h3>
        <Input
          type="text"
          id="small-input"
          placeholder="Search Product Name or Quantity"
          className="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-md:w-full max-md:pl-4 md:w-72 "
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          type="primary"
          onClick={handleAdd}
          className="max-md:w-full max-md:mt-3 max-md:mb-4 max-md:pl-10 max-md:pr-10"
        >
          Add Product
        </Button>
      </div>
      {isMobile ? (
        <div>
          <div
          className="  overflow-y-auto dark:bg-slate-700"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          {
          
          (isSearch?allProduct:totalProduct)?.map((product: formDataProduct, index: number) => (
            <Card
              key={product._id}
              className=" sm:grid-cols-2  border mb-1 rounded-lg shadow-md dark:text-white"
            >
              <div>
                <strong>ID:</strong> {index + 1}
              </div>
              <div>
                <strong>Product Name:</strong> {product.productsname}
              </div>
              <div>
                <strong>Description:</strong> {product.description}
              </div>
              <div>
                <strong>Quantity:</strong> {product.quantity}
              </div>
              <div className="flex justify-center">
                <Button
                  type="primary"
                  onClick={() => handleEdit(product)}
                  className="mr-2 mt-2 max-md:px-8"
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(product._id!)}
                  className="mr-2 mt-2"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
        </div>
      ) : (
        
        <div className=" mt-10">
          <Table
            columns={columns}
            dataSource={allProduct}
            rowClassName="dark:bg-slate-700   " 
            rowKey="_id"
            scroll={{ y: 300, scrollToFirstRowOnChange: true }}
            pagination={{
             position: ["bottomCenter"],
             pageSize:pagination.limit,
             total:totalpages,
             showTotal:(total,range)=>` ${range[0]} to ${range[1]} of ${total} entries`,
             showSizeChanger:true,
              pageSizeOptions:["5","10","15","20"],
              onChange:(page,pageSize)=>{
                handlePaginationChange(page,pageSize)
              }
            }}
            className="w-full"
          />
        </div>
      )}
      <Modal
        title={isEditing ? "Edit Product" : "Create Product"}
        visible={isModalVisible}
        onOk={isEditing ? handleUpdate : handleCreate}
        onCancel={() => setIsModalVisible(false)}
        className="max-w-full md:max-w-lg lg:max-w-xl h-auto md:h-96 lg:h-auto"
      >
        <Form
          form={form}
          initialValues={isEditing ? formData : {}}
          onValuesChange={(_, allValues) => {
            setFormData((prev: formDataProduct) => ({ ...prev, ...allValues }));
          }}
          className="space-y-4 p-4 bg-white shadow-md rounded-md"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row items-center md:space-x-4">
              <label className="md:w-1/4 text-right font-semibold md:text-left">
                Product Name
              </label>
              <Form.Item
                name="productsname"
                rules={[
                  { required: true, message: "Please input product name!" },
                ]}
                className="flex-1"
              >
                <Input className="w-full border border-gray-300 rounded-md shadow-sm" />
              </Form.Item>
            </div>

            <div className="flex flex-col md:flex-row items-center md:space-x-4">
              <label className="md:w-1/4 text-right font-semibold md:text-left">
                Description
              </label>
              <Form.Item name="description" className="flex-1">
                <Input className="w-full border border-gray-300 rounded-md shadow-sm" />
              </Form.Item>
            </div>

            <div className="flex flex-col md:flex-row items-center md:space-x-4">
              <label className="md:w-1/4 text-right font-semibold md:text-left">
                Quantity
              </label>
              <Form.Item
                name="quantity"
                rules={[
                  {
                    required: true,
                    type: "number",
                    message: "Please input quantity!",
                  },
                ]}
                className="flex-1"
              >
                <InputNumber
                  min={1}
                  className="w-full border border-gray-300 rounded-md shadow-sm"
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
