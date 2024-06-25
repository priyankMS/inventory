import { Form, Input, Button, Typography, Row, Col, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSignupMutation } from '../services/Singup';
import { Data } from '../interface/authInterface';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
    <Row justify="center" align="middle" style={{ height: '100vh', background: '#fff', borderRadius: '8px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <Col xs={0} sm={8} md={12} lg={12} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1718095744838-dace5469b218?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100%' }} />
      <Col xs={24} sm={16} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '1rem', }}>
          <Title level={2} style={{ textAlign: 'center' }}>
            Create Account
          </Title>
          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            scrollToFirstError
          >
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your Full Name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Full Name" style={{ width: '80%' }} />
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" style={{ width: '80%' }} />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Please input a valid Email!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" style={{ width: '80%' }} />
            </Form.Item>

            <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <PhoneInput
             
              country={"in"}
              placeholder="Phone Number"
              />
            
          </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" style={{ width: '80%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '80%' }} loading={isLoading}>
                Sign Up
              </Button>
              <Link to="/" style={{ float: 'right', marginTop: '1rem', width: '90%' }}>
                Already have an account? Sign in
              </Link>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default SignUp;