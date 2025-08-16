import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existingCustomer = await this.customerModel.findOne({
      phoneNumber: createCustomerDto.phoneNumber,
    });
    
    if (existingCustomer) {
      throw new ConflictException('Phone number already exists');
    }

    const customer = new this.customerModel(createCustomerDto);
    return customer.save();
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    if (updateCustomerDto.phoneNumber) {
      const existingCustomer = await this.customerModel.findOne({
        phoneNumber: updateCustomerDto.phoneNumber,
        _id: { $ne: id },
      });
      
      if (existingCustomer) {
        throw new ConflictException('Phone number already exists');
      }
    }

    const customer = await this.customerModel.findByIdAndUpdate(
      id,
      updateCustomerDto,
      { new: true },
    );
    
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    
    return customer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.customerModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Customer not found');
    }
  }

  async updateRemainingBill(customerId: string, amount: number): Promise<void> {
    await this.customerModel.findByIdAndUpdate(customerId, {
      $inc: { remainingBill: amount },
    });
  }

  async generateMonthlyBills(): Promise<void> {
    const customers = await this.customerModel.find({ status: 'active' });
    
    for (const customer of customers) {
      const monthlyBill = customer.monthlyAmount - customer.discount;
      await this.updateRemainingBill(customer._id.toString(), monthlyBill);
    }
  }
}