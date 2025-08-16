export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum TransactionType {
  PAYMENT = 'payment',
  EXTRA_CHARGE = 'extraCharge',
}

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface SystemUser {
  id: string;
  username: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  package: string;
  monthlyAmount: number;
  discount: number;
  address: string;
  status: CustomerStatus;
  remainingBill: number;
  lastBillingDate: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customer?: Customer;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  createdBy: string;
  createdByUser?: SystemUser;
  approvedBy?: string;
  approvedByUser?: SystemUser;
  approvedAt?: string;
  description?: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: SystemUser;
}

export interface CreateCustomerRequest {
  name: string;
  phoneNumber: string;
  package: string;
  monthlyAmount: number;
  discount?: number;
  address: string;
  status?: CustomerStatus;
}

export interface CreateTransactionRequest {
  customerId: string;
  type: TransactionType;
  amount: number;
  description?: string;
}

export interface ApproveTransactionRequest {
  transactionId: string;
  status: TransactionStatus;
  reason?: string;
}