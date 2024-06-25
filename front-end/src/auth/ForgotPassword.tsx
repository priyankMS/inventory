import {
  Button,
  Col,
  ConfigProvider,
  Form,
  Input,
  Row,
  Switch,
  Typography,
  message,
} from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../services/ResetPassword";

const { Title } = Typography;

export const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const onFinish = async (values: any) => {
    const response = await forgotPassword(values.email);
    console.log(response);
    if (response.data == "Password reset link sent to your email") {
      message.success(response.data);
      navigate("/")
    } else {
      message.error(response.data);
    }

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
              Reset Password
            </Title>
            <Form
              form={form}
              name="forgotpassword"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </ConfigProvider>
  );
};
