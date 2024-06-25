import React, { useEffect, useState } from "react";
import { Button, Form, FormProps, Input, message } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../services/Singup";
import { jwtDecode } from "jwt-decode";

type FieldType = {
  fullname?: string;
  username?: string;
  email?: string;
  phone?: string;
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

export interface UserProfileProps {
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}

function UserProfile({ setSelectedMenu }: UserProfileProps) {
  const accessToken = sessionStorage.getItem("accessToken");
  const { id }: any = accessToken ? jwtDecode(accessToken) : "";
  const [updateUser] = useUpdateUserMutation();
  const { data: user, refetch } = useGetUserByIdQuery({ id });
  const [formData, setFormData] = useState<FieldType>({});
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      const userData = {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.mobileNumber ? user.mobileNumber.toString() : undefined,
      };
      setFormData(userData);
      form.setFieldsValue(userData);
    }
  }, [user, form]);

  const onFinish = async (values: FieldType) => {
    try {
      const newUser = {
        fullname: values.fullname,
        mobileNumber: values.phone,
      };
      if (!formData) throw new Error("No data found");
      await updateUser({ id, updatedUser: newUser }).unwrap();
      setSelectedMenu("business");
      message.success("User Details Added Successfully");
      refetch();
    } catch (error) {
      console.log("Failed:", error);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    form.resetFields();
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="container mx-auto overflow-hidden ">
      <div className=" flex  justify-between mt-1">
        <p className="lg:mt-5 text-sm">General Owner Details</p>
        {/* <EditOutlined  
       className="text-2xl text-blue-500 cursor-pointer"
        onClick={handleEdit}
      /> */}
      </div>
      <Form
        form={form}
        name="basic"
        initialValues={formData}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="grid lg:mt-10 lg:px-4 grid-cols-1 md:grid-cols-2 lg:gap-4 lg:gap-y-4">
          <Form.Item
            name="fullname"
            // label="Full Name"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input
              placeholder="Full Name"
              className="placeholder-black placeholder-opacity-75 lg:w-3/5 w-full"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="username"
            // label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Username"
              disabled
              className="placeholder-black placeholder-opacity-75 lg:w-3/5 w-full"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="email"
            // label="Email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="Email"
              disabled
              className="placeholder-black placeholder-opacity-75 lg:w-3/5 w-full"
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
              country={"in"}
              inputStyle={mobileStyle as React.CSSProperties}
              placeholder="Phone Number"
              containerClass="lg:w-3/5 w-full"
            />
          </Form.Item>
        </div>
      </Form>
      <div className="flex flex-col md:flex-row items-center justify-between  lg:mt-32 lg:gap-4">
        <Form.Item>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white lg:py-2 lg:px-4 lg:w-32 lg:h-10  md:w-auto rounded-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Form.Item>
        <Form.Item className="form-footer">
          <Button
            type="primary"
            className="lg:h-10 w-full md:w-auto rounded-full"
            htmlType="submit"
            onClick={form.submit}
            icon={<ArrowRightOutlined />}
          >
            Save and continue
          </Button>
        </Form.Item>
      </div>
    </div>
  );
}

export default UserProfile;
