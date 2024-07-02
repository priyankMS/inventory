import { Form, Input, Button, Typography, Row, Col, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSignupMutation } from '../services/Singup';
import { Data } from '../interface/authInterface';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import svgImg from "../assets/undraw_welcome_cats_thqn.svg" 

const { Title } = Typography;

const SignUp = () => {
  const [form] = Form.useForm();
  const [signup, { isLoading }] = useSignupMutation();

  const navigate = useNavigate()

  const handleSubmit = async (values: Data) => {
    try {
      const result = await signup({
        fullname: values.fullname,
        username: values.username,
        email: values.email,
        mobileNumber: values.phone,
        password: values.password,
      }).unwrap();

      message.success("Signup successful!");
      form.resetFields();
      navigate("/")
    } catch (err: any) {
      console.error("Failed to sign up:", err);
      message.error("Signup failed: " + err.data.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:flex md:w-1/2 lg:w-2/3 bg-teal-700 text-white items-center justify-center">
        <div className="text-center">
          <img src={svgImg} alt="Welcome Cats" className="w-96 mx-auto" />
          <h1 className="text-4xl font-bold mb-4">Let's Make it Happen Together!</h1>
          <p className="text-lg mb-4">Join us and start your journey today. We provide the best solutions to help you achieve your goals.</p>
          <ul className="list-disc list-inside text-lg text-left mb-4">
            <li>Professional Support</li>
            <li>Innovative Solutions</li>
            <li>Community Engagement</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 lg:w-1/3 bg-white shadow-lg p-8">
        <div className="w-full max-w-sm">
          <Title level={2} className="text-center mb-2 ">
            Create Account
          </Title>
          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            scrollToFirstError
            className="space-y-4"
          >
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your Full Name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded" />
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" className="w-full p-2  border border-gray-300 rounded" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Please input a valid Email!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" className="w-full p-2  border border-gray-300 rounded" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" className="w-full p-2  border border-gray-300 rounded" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Please input your phone number!" }]}
            >
              <PhoneInput
                country={"in"}
                placeholder="Phone Number"
                // inputClass=" w-[200px] p-2 border border-gray-300 rounded"
                containerClass='w-full   rounded'
               inputStyle={{ width: "100%" }}
              />
            </Form.Item>


            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full  bg-teal-600 text-white rounded" loading={isLoading}>
                Sign Up
              </Button>
              <Link to="/" className="block text-center mt-4 text-teal-600">
                Already have an account? Sign in
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
