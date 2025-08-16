import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TransactionType {
  PAYMENT = 'payment',
  EXTRA_CHARGE = 'extraCharge',
}

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Prop({ required: true, type: Types.ObjectId, ref: 'SystemUser' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SystemUser' })
  approvedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;

  @Prop()
  description?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);