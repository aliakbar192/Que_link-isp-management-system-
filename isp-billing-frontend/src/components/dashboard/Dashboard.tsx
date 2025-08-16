import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Typography } from 'antd';
import { UserOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { customersService } from '../../services/customers.service';
import { transactionsService } from '../../services/transactions.service';
import { Customer, Transaction, TransactionStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSuperAdmin, isAdmin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, transactionsData] = await Promise.all([
          customersService.getAll(),
          transactionsService.getAll(),
        ]);
        setCustomers(customersData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'default';
    }
  };

  const getTransactionStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.APPROVED:
        return 'green';
      case TransactionStatus.PENDING:
        return 'orange';
      case TransactionStatus.REJECTED:
        return 'red';
      default:
        return 'default';
    }
  };

  const customerColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['md'],
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      responsive: ['md'],
    },
    {
      title: 'Package',
      dataIndex: 'package',
      key: 'package',
      responsive: ['lg'],
    },
    {
      title: 'Remaining Bill',
      dataIndex: 'remainingBill',
      key: 'remainingBill',
      render: (amount: number) => (
        <span className={`font-semibold ${amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
          ${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customerName',
      responsive: ['md'],
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'payment' ? 'green' : 'orange'}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-semibold">${amount.toFixed(2)}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: TransactionStatus) => (
        <Tag color={getTransactionStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      responsive: ['lg'],
    },
  ];

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRemainingBill = customers.reduce((sum, c) => sum + c.remainingBill, 0);
  const pendingTransactions = transactions.filter(t => t.status === TransactionStatus.PENDING).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>Dashboard</Title>
        <Space>
          {(isSuperAdmin || isAdmin) && (
            <Button type="primary" href="/customers/new">
              Add Customer
            </Button>
          )}
          {isAdmin && (
            <Button type="default" href="/transactions/new">
              New Transaction
            </Button>
          )}
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Customers"
              value={activeCustomers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Outstanding"
              value={totalRemainingBill}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Approvals"
              value={pendingTransactions}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Customers */}
      <Card title="Recent Customers" className="mb-6">
        <Table
          dataSource={customers.slice(0, 5)}
          columns={customerColumns}
          rowKey="id"
          pagination={false}
          loading={loading}
          size="small"
          scroll={{ x: true }}
        />
      </Card>

      {/* Recent Transactions */}
      <Card title="Recent Transactions" className="mb-6">
        <Table
          dataSource={transactions.slice(0, 5)}
          columns={transactionColumns}
          rowKey="id"
          pagination={false}
          loading={loading}
          size="small"
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;