import {  useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Dropdown,
  Modal,
  MenuProps,
  Space,
} from "antd";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  DownOutlined,
  UnorderedListOutlined,
  BankOutlined,
  MoonFilled,
  SunFilled,
  UserAddOutlined,
  EditOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

import Dashboard from "./Dashboard";
import Product from "./Product";
import OrderList from "./Orderlist";
import Company from "./Company";
import Mainbar from "./userProfile/Mainbar";
import Token from "./Token";

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAppDispatch, useAppSelectore } from "../services/hook";
import { toggleTheme } from "../services/slice/authslice";

import logo from "./Logo/inventory.png";
import logo2 from "./Logo/i2.png";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;
const { confirm } = Modal;

const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 40;

const AppBar = () => {
  const [siderWidth, setSiderWidth] = useState(140);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const accessToken = sessionStorage.getItem("accessToken");
  const { username, email }: any = accessToken ? jwtDecode(accessToken) : {};

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelectore((state) => state.auth.theme);

  useEffect(() => {
    const resize = () => {
      setSiderWidth(window.innerWidth < 768 ? 70 : 140);
    };
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  const logout = () => {
    confirm({
      title: "Do you want to log out?",
      onOk() {
        axios
          .get("http://localhost:3000/auth/logout", {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          })
          .finally(() => {
            sessionStorage.clear();
            navigate("/");
          });
      },
    });
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return <Dashboard />;
      case "product":
        return <Product />;
      case "orderlist":
        return <OrderList />;
      case "company":
        return <Company />;
      case "mainbar":
        return <Mainbar />;
      default:
        return null;
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <Space className="border-b w-full p-2">
          <Avatar className="bg-lime-600">{username?.[0]}</Avatar>
          <div>
            <Text strong>{username}</Text>
            <br />
            <Text type="secondary" className="text-xs">
              {email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      key: "edit",
      label: (
        <div onClick={() => setSelectedMenu("mainbar")}>
          <UserAddOutlined /> Edit Profile
        </div>
      ),
    },
    {
      key: "password",
      label: (
        <div onClick={() => navigate("/forgotpassword")}>
          <EditOutlined /> Change Password
        </div>
      ),
    },
    {
      key: "logout",
      label: (
        <div onClick={logout}>
          <PoweroffOutlined /> Logout
        </div>
      ),
    },
  ];

  return (
    <div className={`${theme} h-screen`}>
      <Token />

      <Layout className="h-full">
        {/* SIDEBAR */}
        <Sider
  width={siderWidth}
  className="!h-full !bg-gradient-to-b from-[#0B1C2D] to-[#071423]"
>

          <div className="p-4 text-center">
            <img
              src={theme === "dark" ? logo : logo2}
              className="rounded"
              alt="logo"
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={(e) => setSelectedMenu(e.key)}
          >
            <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="product" icon={<ShoppingCartOutlined />}>
              Product
            </Menu.Item>
            <Menu.Item key="company" icon={<BankOutlined />}>
              Company
            </Menu.Item>
            <Menu.Item key="orderlist" icon={<UnorderedListOutlined />}>
              Orderlist
            </Menu.Item>
          </Menu>
        </Sider>

        {/* MAIN */}
        <Layout>
          {/* HEADER */}
          <Header
            style={{ height: HEADER_HEIGHT }}
            className="flex justify-end items-center bg-white dark:bg-slate-900 px-4 shadow"
          >
            <Space size="large">
              <div
                className="cursor-pointer text-xl"
                onClick={() => dispatch(toggleTheme())}
              >
                {theme === "dark" ? <MoonFilled /> : <SunFilled />}
              </div>

              <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                <Space className="cursor-pointer">
                  <Avatar className="bg-lime-600">{username?.[0]}</Avatar>
                  <DownOutlined />
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* CONTENT */}
          <Content
            style={{
              height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
            }}
            className="overflow-y-auto bg-gray-50 dark:bg-slate-800 p-4"
          >
            {renderContent()}
          </Content>

          {/* FOOTER */}
          <Footer
            style={{ height: FOOTER_HEIGHT }}
            className="text-center bg-white dark:bg-slate-900 border-t text-xs"
          >
            © {new Date().getFullYear()} Inventory Management System · All rights
            reserved
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default AppBar;
