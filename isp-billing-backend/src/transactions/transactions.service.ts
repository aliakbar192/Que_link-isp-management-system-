import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionStatus, TransactionType } from '../schemas/transaction.schema';
import { Customer } from '../schemas/customer.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApproveTransactionDto } from './dto/approve-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transaction> {
    const customer = await this.customerModel.findById(createTransactionDto.customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const transaction = new this.transactionModel({
      ...createTransactionDto,
      customerId: new Types.ObjectId(createTransactionDto.customerId),
      createdBy: new Types.ObjectId(userId),
      status: TransactionStatus.PENDING,
    });

    return transaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel
      .find()
      .populate('customerId', 'name phoneNumber')
      .populate('createdBy', 'username')
      .populate('approvedBy', 'username')
      .sort({ createdAt: -1 });
  }

  async findPending(): Promise<Transaction[]> {
    return this.transactionModel
      .find({ status: TransactionStatus.PENDING })
      .populate('customerId', 'name phoneNumber')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('customerId', 'name phoneNumber')
      .populate('createdBy', 'username')
      .populate('approvedBy', 'username');
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    
    return transaction;
  }

  async approve(
    approveTransactionDto: ApproveTransactionDto,
    superAdminId: string,
  ): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(approveTransactionDto.transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction is not pending');
    }

    transaction.status = approveTransactionDto.status;
    transaction.approvedBy = new Types.ObjectId(superAdminId);
    transaction.approvedAt = new Date();

    if (transaction.status === TransactionStatus.APPROVED) {
      await this.updateCustomerBalance(transaction);
    }

    return transaction.save();
  }

  private async updateCustomerBalance(transaction: Transaction): Promise<void> {
    const customer = await this.customerModel.findById(transaction.customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    let amountChange = 0;
    if (transaction.type === TransactionType.PAYMENT) {
      amountChange = -transaction.amount; // Payment reduces remaining bill
    } else if (transaction.type === TransactionType.EXTRA_CHARGE) {
      amountChange = transaction.amount; // Extra charge increases remaining bill
    }

    await this.customerModel.findByIdAndUpdate(customer._id, {
      $inc: { remainingBill: amountChange },
    });
  }

  async getDailyCollectionReport(date: string): Promise<any[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return this.transactionModel.aggregate([
      {
        $match: {
          status: TransactionStatus.APPROVED,
          type: TransactionType.PAYMENT,
          approvedAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async getMonthlyCollectionReport(year: number, month: number): Promise<any[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return this.transactionModel.aggregate([
      {
        $match: {
          status: TransactionStatus.APPROVED,
          approvedAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);
  }
}