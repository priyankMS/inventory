import { Button, Form, FormProps, Input, message } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type FieldType = {
  companyname?: string;
  address?: string;
  mobile?: string;
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


function Business({
  setSelectedMenu,
}: {
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setSelectedMenu("banking");
    message.success("Business Details Added Successfully");
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleReset = () => {
    form.resetFields();
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
        <div className="grid lg:mt-10 grid-cols-1 lg:px-4 md:grid-cols-3 lg:gap-4">
          <Form.Item
            name="companyname"
            rules={[
              { required: true, message: "Please input your company name!" },
            ]}
          >
            <Input
              placeholder="Company Name"
              value={form.getFieldValue("companyname")}
              className="placeholder-black placeholder-opacity-75"
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
              className="placeholder-black placeholder-opacity-75"
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
              className="placeholder-black placeholder-opacity-75"
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
          rules={[{ required: true, message: "Please input your GST number!" }]}
          >
          <Input
            placeholder="GST Number"
            value={form.getFieldValue("gst")}
            className="placeholder-black placeholder-opacity-75"
            style={style}
            />
        </Form.Item>
            </div>

          </Form>

        <div className="flex flex-col md:flex-row  gap-3 justify-between lg:mt-20">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white  lg:h-10 rounded-full"
            onClick={handleReset}
          >
            Cancel
          </Button>

          <div className="flex gap-4">
            <Button
              type="default"
              onClick={() => setSelectedMenu("profile")}
              className="bg-blue-500 hover:bg-blue-700 text-white lg:h-10 py-2 px-4 rounded-full"
            >
              Previous
            </Button>

            <Button
              htmlType="submit"
              onClick={form.submit}
              className="bg-blue-500 hover:bg-blue-700 text-white lg:h-10 py-2 px-4 rounded-full"
            >
              Save and Continue
            </Button>
          </div>
        </div>
    </div>
  );
}

export default Business;
