# ISP Billing Management System

A complete billing management system for Internet Service Providers built with NestJS backend and React frontend.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with access & refresh tokens
- Role-based access control (SuperAdmin & Admin)
- Secure password hashing with bcrypt

### Customer Management
- Create, read, update, and delete customers
- Customer fields: name, phone, package, monthly amount, discount, address, status
- Automatic remaining bill calculation

### Billing System
- Automatic monthly bill generation on the 1st of every month
- Payment and extra charge management
- Approval workflow for SuperAdmin

### Transaction Management
- Create payments and extra charges
- Approval/rejection system
- Full audit trail with timestamps

### Reporting
- Daily collection reports
- Monthly collection reports
- Customer billing breakdowns

### Mobile Responsive UI
- Built with Ant Design + TailwindCSS
- Responsive tables and forms
- Mobile-first design approach

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Scheduling**: @nestjs/schedule

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Ant Design
- **Styling**: TailwindCSS
- **State Management**: React Context
- **Routing**: React Router v6
- **HTTP Client**: Axios

## 📁 Project Structure

```
├── isp-billing-backend/          # NestJS Backend
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   ├── customers/            # Customer management
│   │   ├── transactions/         # Transaction management
│   │   ├── billing/              # Billing automation
│   │   ├── seeder/               # Database seeding
│   │   └── schemas/              # MongoDB schemas
│   └── .env                      # Environment variables
│
└── isp-billing-frontend/         # React Frontend
    ├── src/
    │   ├── components/           # React components
    │   ├── services/             # API services
    │   ├── contexts/             # React contexts
    │   └── types/                # TypeScript types
    └── tailwind.config.js        # TailwindCSS config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd isp-billing-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Update MongoDB URI and JWT secrets
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   ```

5. **Seed the database**
   ```bash
   # Create initial SuperAdmin user
   curl -X POST http://localhost:3001/seeder
   ```

6. **Start the backend**
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd isp-billing-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend**
   ```bash
   npm start
   ```

## 🔐 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `SuperAdmin`

## 📱 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile

### Customers
- `GET /customers` - List all customers
- `POST /customers` - Create new customer
- `GET /customers/:id` - Get customer details
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Transactions
- `GET /transactions` - List all transactions
- `POST /transactions` - Create new transaction
- `GET /transactions/pending` - Get pending transactions
- `POST /transactions/approve` - Approve/reject transaction

### Reports
- `GET /transactions/reports/daily` - Daily collection report
- `GET /transactions/reports/monthly` - Monthly collection report

### Billing
- `POST /billing/generate-monthly-bills` - Manual bill generation

## 🔒 Security Features

- JWT token-based authentication
- Role-based access control
- Password hashing with bcrypt
- Request validation with class-validator
- CORS protection
- Rate limiting (configurable)

## 📊 Database Models

### SystemUser
```typescript
{
  username: string;
  password: string;
  role: 'SuperAdmin' | 'Admin';
  isActive: boolean;
  createdAt: Date;
}
```

### Customer
```typescript
{
  name: string;
  phoneNumber: string;
  package: string;
  monthlyAmount: number;
  discount: number;
  address: string;
  status: 'active' | 'inactive';
  remainingBill: number;
  lastBillingDate: Date;
  createdAt: Date;
}
```

### Transaction
```typescript
{
  customerId: ObjectId;
  type: 'payment' | 'extraCharge';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: ObjectId;
  approvedBy?: ObjectId;
  approvedAt?: Date;
  description?: string;
  createdAt: Date;
}
```

## 🎨 UI Components

- **Responsive Tables**: Collapse to cards on mobile
- **Form Components**: Stack vertically on small screens
- **Dashboard Cards**: Responsive grid layout
- **Navigation**: Collapsible sidebar
- **Mobile Menu**: Touch-friendly interface

## 🚀 Deployment

### Backend
```bash
npm run build
npm run start:prod
```

### Frontend
```bash
npm run build
# Serve the build folder with nginx or similar
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
