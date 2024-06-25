    import { Layout, Menu, Typography } from "antd";
    import { ProfileOutlined, BankOutlined, DollarOutlined } from "@ant-design/icons";
    import UserProfile from "./USerProfile";
    import Banking from "./Banking";
    import Business from "./Business";
    import { SetStateAction, useState } from "react";

    const { Header, Content } = Layout;
    const { Paragraph } = Typography;

    const Mainbar = () => {
        const [selectedMenu, setSelectedMenu] = useState("profile");
        

      
        
        const handleMenuClick = (e: { key: SetStateAction<string>; }) => {
            setSelectedMenu(e.key);
        }

        const renderContent = () => {
            switch (selectedMenu) {
                case "profile":
                    return <UserProfileContent />;
                case "banking":
                    return <BankingContent />;
                case "business":
                    return <BusinessContent />;
                  
                default:
                    return <UserProfileContent />;
            }
        }

        const UserProfileContent = () => (
            <Paragraph className="h-full">
                <UserProfile setSelectedMenu={setSelectedMenu}/>
            </Paragraph>
        )

        const BankingContent = () => (
            <Paragraph className="h-full">
                <Banking   setSelectedMenu={setSelectedMenu}/>
            </Paragraph>
        )

        const BusinessContent = () => (
            <Paragraph className="h-full">
                <Business setSelectedMenu={setSelectedMenu} />
            </Paragraph>
        )

        console.log(selectedMenu);
        
        return (
            <Layout className=" bg-transparent">
                <Header 
                  
                className="flex  sm:w-[350px] bg-transparent  p-0  justify-between  sticky  ">
                    <Menu
                        className=" w-[100px] h-10 md:h-full sm:w-full   bg-neutral-300 justify-around  rounded-full  flex  items-center"
                        theme="light"
                         mode="horizontal"
                              
                        defaultSelectedKeys={["profile"]}
                        selectedKeys={[selectedMenu]}
                        
                        onClick={handleMenuClick}
                    >
                        <Menu.Item
                            key="profile"
                        
                            style={{ backgroundColor: selectedMenu === "profile" ? "white" : "" ,borderRadius: "50px", height: "43px",display:"flex",alignItems:"center"}}
                            icon={<ProfileOutlined />}
                        >
                            Profile
                        </Menu.Item>
                        <Menu.Item
                            key="business"
                            style={{ backgroundColor: selectedMenu === "business" ? "white" : "" ,borderRadius: "50px", height: "43px",display:"flex",alignItems:"center"}}
                            icon={<DollarOutlined />}
                        >
                            Business
                        </Menu.Item>
                        <Menu.Item
                            key="banking"
                            style={{ backgroundColor: selectedMenu === "banking" ? "white" : "" ,borderRadius: "50px", height: "43px",display:"flex",alignItems:"center"}}
                            icon={<BankOutlined />}
                        >
                            Banking
                        </Menu.Item>
                     
                    </Menu>
                </Header>
                <Content 
                 className="bg-none"
                >
                    {renderContent()}
                </Content>
            </Layout>
        );
    };

    export default Mainbar;
