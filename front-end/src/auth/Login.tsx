import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Checkbox,
  Input,
  Form,
  Row,
  Col,
  ConfigProvider,
  Switch,
  message,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/Login";
import { useAppDispatch } from "../services/hook";
import { loginUser } from "../services/slice/authslice";

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [login, { isLoading }] = useLoginMutation();
  const [theme, setTheme] = useState("light");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onFinish = async (values: any) => {
    try {
      const response: any = await login(values);
       
      if (response.error) {
        if (response.error.data.message) {
          return message.error(response.error.data.message);
        } else {
          form.resetFields();
          return message.error("Invalid username/email or password");
        }
      }
      sessionStorage.setItem("accessToken", response.data);
      dispatch(loginUser(response.data));

      message.success("Login successful");
      form.resetFields();
      navigate("/dashboard");
    } catch (error) {
      message.error("Invalid username/email or password");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ConfigProvider prefixCls={theme}>
      <Row
        justify="center"
        align="middle"
        style={{
          minHeight: "100vh",
          background: theme === "light" ? "#f0f2f5" : "#001529",
        }}
      >
        <Col xs={24} sm={16} md={12} lg={8} xl={6}>
          <div
            style={{
              padding: "2rem",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Row justify="end" style={{ marginBottom: "1rem" }}>
              <Col>
                <Switch checked={theme === "dark"} onChange={toggleTheme} />
              </Col>
            </Row>
            <Title level={2} style={{ textAlign: "center" }}>
              Sign in
            </Title>
            <Form
              form={form}
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="input"
                rules={[
                  { required: true, message: "Please input your username or email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username or Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a
                  className="login-form-forgot"
                  href=""
                  onClick={() => navigate("/forgotpassword")}
                >
                  Forgot password
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={isLoading}
                >
                  Log in
                </Button>
                <RouterLink to="/signup">register now!</RouterLink>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </ConfigProvider>
  );
};

export default Login;