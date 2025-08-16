import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  package: string;

  @Prop({ required: true, min: 0 })
  monthlyAmount: number;

  @Prop({ default: 0, min: 0 })
  discount: number;

  @Prop({ required: true })
  address: string;

  @Prop({ enum: CustomerStatus, default: CustomerStatus.ACTIVE })
  status: CustomerStatus;

  @Prop({ default: 0, min: 0 })
  remainingBill: number;

  @Prop({ default: new Date() })
  lastBillingDate: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);