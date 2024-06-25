import { Button, Form, FormProps, Input, message } from "antd";
import "react-phone-input-2/lib/style.css";

type FieldType = {
  accountnumber?: string;
  ifsccode?: string;
  bankname?: string;
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



function Banking({
  setSelectedMenu,
}: {
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setSelectedMenu("summary");
    message.success("Banking Details Added Successfully");
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
      <p className="text-sm lg:mt-5 ">Banking Details</p>
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
            name="accountnumber"
            rules={[
              { required: true, message: "Please input your account number!" },
            ]}
          >
            <Input
              placeholder="Account Number"
              value={form.getFieldValue("accountnumber")}
              className="placeholder-black placeholder-opacity-75"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="ifsccode"
            rules={[{ required: true, message: "Please input your IFSC code!" }]}
          >
            <Input
              placeholder="IFSC Code"
              value={form.getFieldValue("ifsccode")}
              className="placeholder-black placeholder-opacity-75"
              style={style}
            />
          </Form.Item>

          <Form.Item
            name="bankname"
            rules={[{ required: true, message: "Please input your bank name!" }]}
          >
            <Input
              placeholder="Bank Name"
              value={form.getFieldValue("bankname")}
              className="placeholder-black placeholder-opacity-75"
              style={style}
            />
          </Form.Item>
        </div>
      </Form>

      <div className="flex flex-col md:flex-row  gap-3 justify-between lg:mt-20">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white lg:h-10 rounded-full"
          onClick={handleReset}
        >
          Cancel
        </Button>

        <div className="flex   gap-4">
          <Button
            type="default"
            onClick={() => setSelectedMenu("business")}
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

export default Banking;
