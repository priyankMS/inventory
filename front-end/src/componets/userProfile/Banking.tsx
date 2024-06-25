import { Button, Form, FormProps, Input, message } from "antd";
import "react-phone-input-2/lib/style.css";
import { useCreateBankMutation } from "../../services/Banking";
import { useState } from "react";

type FieldType = {
  accountNumber?: string;
  ifsccode?: string;
  bankName?: string;
  city?: string;
  address?: string;
  state?: string;
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

function Banking({
  setSelectedMenu,
}: {
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [form] = Form.useForm();
  const [createBank] = useCreateBankMutation();
  const [loading, setLoading] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      await createBank(values).unwrap();
      message.success("Banking Details Added Successfully");
      setSelectedMenu("summary");
      console.log("Success:", values);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.data?.message || "Failed to add banking details. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form for errors and try again.");
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className="container mx-auto lg:p-4">
      <p className="text-sm lg:mt-5">Banking Details</p>


      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="grid lg:mt-10 grid-cols-1  md:grid-cols-2 lg:grid-cols-3 lg:px-4 lg:gap-4">
          <div className="relative z-0 w-full mb-6 group">
            <Form.Item
              name="accountNumber"
              rules={[
                { required: true, message: "Please input your account number!" },
              ]}
            >
              <Input
                placeholder="Account Number"
                className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
                style={style}
              />
            </Form.Item>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <Form.Item
              name="ifsccode"
              rules={[
                { required: true, message: "Please input your IFSC code!" },
              ]}
            >
              <Input
                placeholder="IFSC Code"
                className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
                style={style}
              />
            </Form.Item>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <Form.Item
              name="bankName"
              rules={[
                { required: true, message: "Please input your bank name!" },
              ]}
            >
              <Input
                placeholder="Bank Name"
                className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
                style={style}
              />
            </Form.Item>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <Form.Item
              name="state"
              rules={[
                { required: true, message: "Please input your State name!" },
              ]}
            >
              <Input
                placeholder="State"
                className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
                style={style}
              />
            </Form.Item>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <Form.Item
              name="city"
              rules={[
                { required: true, message: "Please input your city name!" },
              ]}
            >
              <Input
                placeholder="City"
                className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
                style={style}
              />
            </Form.Item>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <Form.Item
              name="address"
              rules={[
                { required: true, message: "Please input your address name!" },
              ]}
            >
              <Input
                placeholder="Address"
                className="placeholder-black placeholder-opacity-75  lg:w-3/5 w-full"
                style={style}
              />
            </Form.Item>
          </div>
        </div>
      </Form>

      <div className="flex flex-col md:flex-row gap-3 justify-between lg:mt-20">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white lg:h-10 rounded-full"
          onClick={handleReset}
          disabled={loading}
        >
          Cancel
        </Button>

        <div className="flex gap-4">
          <Button
            type="default"
            onClick={() => setSelectedMenu("business")}
            className="bg-blue-500 hover:bg-blue-700 text-white lg:h-10 py-2 px-4 rounded-full"
            disabled={loading}
          >
            Previous
          </Button>

          <Button
            htmlType="submit"
            onClick={form.submit}
            className="bg-blue-500 hover:bg-blue-700 text-white lg:h-10 py-2 px-4 rounded-full"
            loading={loading}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Banking;