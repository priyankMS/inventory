import {
  Button,
  Col,
  ConfigProvider,
  Form,
  Input,
  Row,
  Switch,
  Typography,
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../services/ResetPassword";

const { Title } = Typography;

export const ResetPassword = () => {
  const [resetPassword] = useResetPasswordMutation();
  const [token] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const onFinish = async (values: any) => {
    await resetPassword({
      token: token.get("token"),
      password: values.password,
    });
    navigate("/");
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
              name="resetpassword"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter correct password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
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
