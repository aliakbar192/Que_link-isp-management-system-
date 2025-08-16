import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TransactionStatus } from '../../schemas/transaction.schema';

export class ApproveTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status: TransactionStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}