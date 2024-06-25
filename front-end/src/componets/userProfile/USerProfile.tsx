import React from "react";
import { Button, Form, FormProps, Input, message } from "antd";
import ReactFlagsSelect from "react-flags-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ArrowRightOutlined } from "@ant-design/icons";

type FieldType = {
  fullname?: string;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  country?: string;
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
  width: "80%",
};
const mobileStyle = {
 
  
  '@media (max-width: 600px)': { 
    width: "50%",
  },
  '@media (min-width: 600px)': {
    width: "100%",
  },
}

export interface UserProfileProps {
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;

}

function UserProfile({ setSelectedMenu }: UserProfileProps) {
  
  
  const [selected, setSelected] = React.useState<string>("");
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setSelectedMenu("business")
    message.success("User Details Added Successfully");
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  React.useEffect(() => {
    form.setFieldsValue({ country: selected });
  }, [selected, form]);

  const handleCancel = ()=>{
    form.resetFields();
  }

  return (
    <div className="container mx-auto overflow-hidden">
      <p className=" lg:mt-5 text-sm" >General Owner Details</p>
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
       <div className="grid lg:mt-10 lg:px-4 grid-cols-1 md:grid-cols-3 lg:gap-4">
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Please input your first name!" }]}
          >
            <Input
              placeholder="Full Name"
               className="placeholder-black placeholder-opacity-75"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your last name!" }]}
          >
            <Input.Password
              placeholder="password"
              
              className="placeholder-black placeholder-opacity-75 "
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Username"
              className="placeholder-black placeholder-opacity-75"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="Email"
              className="placeholder-black placeholder-opacity-75"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Please input your phone number!" }]}
            
           >
            <PhoneInput country={"in"}
             inputStyle={mobileStyle as React.CSSProperties}
            placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            name="country"
            rules={[{ required: true, message: "Please select your country!" }]}
          >
            <ReactFlagsSelect
              placeholder="Select nationality"
              searchable
              searchPlaceholder="Search for a country"
              className="  md:w-60 w-36 lg:w-72 "
              selected={selected}
              
              onSelect={(code) => {
                setSelected(code);
                form.setFieldsValue({ country: code });
              }}
            />
          </Form.Item>
        </div>

               
              </Form>
              <div className="flex flex-col   md:flex-row justify-between lg:mt-20">
                <Form.Item>
                  <Button 
                   className="bg-blue-500 hover:bg-blue-700 text-white  lg:py-2 lg:px-4  lg:w-32 lg:h-10 rounded-full"
                  onClick={handleCancel}>cancel</Button>
                </Form.Item>
                <Form.Item className="form-footer">
                  <Button type="primary"
                   className="  lg:h-10 rounded-full"
                  htmlType="submit" 
                  onClick={form.submit}
                  icon={<ArrowRightOutlined />}>
                    Save and countinue
                  </Button>
                </Form.Item>
                </div>
    </div>
  );
}

export default UserProfile;
