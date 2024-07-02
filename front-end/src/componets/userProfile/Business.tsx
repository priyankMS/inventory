import { Button, Form, FormProps, Input, message } from "antd";
import { jwtDecode } from "jwt-decode";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  useCreateBusinessMutation,
  useGetAllBusinessQuery,
  useGetBusinessByIdQuery,
  useUpdateBusinessMutation,
} from "../../services/Business";
import { useEffect, useState } from "react";

type FieldType = {
  companyname?: string;
  address?: string;
  phone?: string;
  email?: string;
  gst?: string;
};

const style = {
  fontSize: "15px",
  color: "black",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid #ccc",
  boxShadow: "none",
  outline: "none",
  borderRadius: "0px",
  padding: "2px 0px",
};

const mobileStyle = {
  width: "100%",
};

function Business({
  setSelectedMenu,
}: {
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}) {
  const accessToken = sessionStorage.getItem("accessToken");
  const { id }: any = accessToken ? jwtDecode(accessToken) : "";
  const [updateBusiness] = useUpdateBusinessMutation();
  const [creatBusiness] = useCreateBusinessMutation();
  const { data: allBusiness } = useGetAllBusinessQuery({});

  const findId = allBusiness?.find(
    (business) => business.createdBy._id === id
  )._id;

  const { data: business, refetch } = useGetBusinessByIdQuery(findId);

  const [businessData, setBusinessData] = useState<FieldType>({});

  const [form] = Form.useForm();

  useEffect(() => {
    if (business) {
      const businessData = {
        companyname: business.companyname,
        address: business.address,
        email: business.email,
        phone: business.phone ? business.phone.toString() : undefined,
        gst: business.gst,
      };
      setBusinessData(businessData);
      form.setFieldsValue(businessData);
    }
  }, [business, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const newBusiness = {
        companyname: values.companyname,
        address: values.address,
        email: values.email,
        phone: values.phone,
        gst: values.gst,
      };

      if (!businessData) throw new Error("No data found");
      if (business) {
        const hasChanges = Object.keys(businessData).some(
          (key) => businessData[key] !== newBusiness[key]
        );
        if (hasChanges) {
          await updateBusiness({
            id: business._id,
            updateBusiness: newBusiness,
          }).unwrap();
          message.success("Business updated successfully");
        } else {
          message.info("No changes made");
          setSelectedMenu("banking");
        }
      } else {
        await creatBusiness(newBusiness).unwrap();
        message.success("Business created successfully");
      }
      refetch();
      setSelectedMenu("banking");
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleReset = () => {
    if (business) {
      form.setFieldsValue(businessData);
    } else {
      form.resetFields();
    }
  };

  return (
    <div className="container mx-auto lg:p-4">
      <p className="text-sm lg:mt-5 ">Business Details</p>
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="grid lg:mt-10 grid-cols-1 lg:px-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-4">
          <Form.Item
            name="companyname"
            rules={[
              { required: true, message: "Please input your company name!" },
            ]}
            className="lg:w-[85%] w-full"
          >
            <Input
              placeholder="Company Name"
              value={form.getFieldValue("companyname")}
              className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input
              placeholder="Company Address"
              value={form.getFieldValue("address")}
              className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="Company Email"
              value={form.getFieldValue("email")}
              className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <PhoneInput
              value={form.getFieldValue("phone")}
              country={"in"}
              placeholder="Phone Number"
              inputStyle={mobileStyle as React.CSSProperties}
            />
          </Form.Item>

          <Form.Item
            name="gst"
            rules={[
              { required: true, message: "Please input your GST number!" },
            ]}
          >
            <Input
              placeholder="GST Number"
              value={form.getFieldValue("gst")}
              className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
              style={style}
            />
          </Form.Item>
        </div>
      </Form>

      <div className="flex flex-col md:flex-row  gap-3 justify-between items-center mt-10 lg:mt-28">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white  w-[100px]   lg:h-10 rounded-full"
          onClick={handleReset}
        >
          Cancel
        </Button>

        <div className="flex gap-4">
          <Button
            type="default"
            onClick={() => setSelectedMenu("profile")}
            className="bg-blue-500 hover:bg-blue-700 text-white lg:h-10 lg:py-2 lg:px-4 rounded-full"
          >
            Previous
          </Button>

          <Button
            htmlType="submit"
            onClick={form.submit}
            className="bg-blue-500 hover:bg-blue-700 text-white lg:h-10 lg:py-2 lg:px-4 rounded-full"
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Business;
