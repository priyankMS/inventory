import { SetStateAction, useEffect, useState } from "react";
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
import "tailwindcss/tailwind.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import logo from "./Logo/inventory.png";
import logo2 from "./Logo/i2.png";
import axios from "axios";
import Company from "./Company";
import Token from "./Token";
import { useAppDispatch, useAppSelectore } from "../services/hook";
import { toggleTheme } from "../services/slice/authslice";

import Mainbar from "./userProfile/Mainbar";

const { Header, Sider, Content } = Layout;
const { Text, Paragraph } = Typography;
const { confirm } = Modal;

const AppBar = () => {
  const [siderWidth, setSiderWidth] = useState<number>(140);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const accessToken = sessionStorage.getItem("accessToken");
  const { username }: any = accessToken ? jwtDecode(accessToken) : "";
  const { email }: any = accessToken ? jwtDecode(accessToken) : "";
  const navigate = useNavigate();
  const theme = useAppSelectore((state) => state.auth.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 768) {
        setSiderWidth(70);
      } else {
        setSiderWidth(140);
      }
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
          .then(() => {
            sessionStorage.removeItem("accessToken");
            localStorage.clear();
            navigate("/");
          })
          .catch(() => {
            console.log("Logout failed");
          });
      },
      onCancel() {
        console.log("Logout cancelled");
      },
    });
  };

  console.log("email", email);

  const handleMenuClick = (e: { key: SetStateAction<string> }) => {
    setSelectedMenu(e.key);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "product":
        return <ProductContent />;
      case "orderlist":
        return <OrderListContent />;
      case "company":
        return <CompanyContent />;
      case "mainbar":
        return <MainbarContent />;
      default:
        return null;
    }
  };

  const DashboardContent = () => (
    <Paragraph className="h-full">
      <Dashboard />
    </Paragraph>
  );

  const ProductContent = () => (
    <Paragraph className="h-full">
      <Product />
    </Paragraph>
  );

  const OrderListContent = () => (
    <Paragraph className="h-full">
      <OrderList />
    </Paragraph>
  );

  const CompanyContent = () => (
    <Paragraph className="h-full">
      <Company />
    </Paragraph>
  );

  const MainbarContent = () => (
    <Paragraph className=" h-full">
      <Mainbar />
    </Paragraph>
  );

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <Space   className=" border-b-[1px] flex p-1">
          <Avatar className="bg-lime-600 w-10 h-10 ">{username[0]}</Avatar>
          <div className=" flex flex-col">
            <Text className=" font-semibold">{username}</Text>
            <Text type="secondary" className=" text-xs">{email}</Text>
          </div>
        </Space>
      ),
    },
    {
      key: "1",
      label: (
        <div
          className=" border-b-[1px] flex gap-4 p-1"
          onClick={() => setSelectedMenu("mainbar")}
        >
          {<UserAddOutlined />}edit Profile
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className=" border-b-[1px] flex gap-4 p-1"
        onClick={() => navigate("/forgotpassword")}>
         {<EditOutlined />}   Change Password
        </div>
      ),
    },
    {
      key: "3",
      label: <div
       className="  flex gap-4 p-1"
      onClick={logout}>
       {<PoweroffOutlined />} Logout
        </div>,
    },
  ];

  return (
    <div className={`${theme}  h-[100vh]` }>
      <Token />
      <Layout className="  h-screen flex flex-col md:flex-row">
        <Sider
          trigger={null}
          collapsible
          width={siderWidth}
          className="bg-gray-80 dark:bg-slate-200  w-6"
        >
          <div className="p-4 text-center">
            <img
              src={theme === "dark" ? logo : logo2}
              alt="Logo"
              className="max-w-full rounded-lg"
            />
          </div>
          <Menu
            theme={`${theme === "dark" ? "light" : "dark"}`}
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            selectedKeys={[selectedMenu]}
            onClick={handleMenuClick}
            className="bg-gray-80 dark:bg-slate-200"
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
        <Layout className="site-layout">
          <Header className="  flex  justify-end items-center bg-white shadow px-3 dark:bg-slate-900 dark:text-white">
            <div className="flex items-center space-x-4">
              <div
                className={`flex text-2xl cursor-pointer  `}
                onClick={() => dispatch(toggleTheme())}
              >
                {theme === "dark" ? <MoonFilled /> : <SunFilled />}
              </div>
              <Text className="text-lg font-semibold dark:text-white">
                {username}
              </Text>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <div className="flex items-center cursor-pointer">
                  <Avatar className="bg-lime-600">{username[0]}</Avatar>
                  <DownOutlined className="ml-2" />
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content className="m-4     bg-white dark:bg-slate-900 shadow rounded">
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AppBar;
