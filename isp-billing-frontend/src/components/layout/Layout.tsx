import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  TransactionOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Customers',
    },
    {
      key: '/transactions',
      icon: <TransactionOutlined />,
      label: 'Transactions',
    },
    ...(isSuperAdmin
      ? [
          {
            key: '/approvals',
            icon: <UserSwitchOutlined />,
            label: 'Approvals',
          },
        ]
      : []),
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntLayout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white border-r">
        <div className="p-4 text-center">
          <h1 className={`text-lg font-bold text-blue-600 ${collapsed ? 'hidden' : 'block'}`}>
            ISP Billing
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-0"
        />
      </Sider>
      
      <AntLayout>
        <Header className="bg-white px-6 flex items-center justify-between border-b">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, <span className="font-semibold">{user?.username}</span>
            </span>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space className="cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <span className="text-sm text-gray-600">{user?.role}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;