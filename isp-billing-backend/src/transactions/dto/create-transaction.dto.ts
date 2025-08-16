import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsEnum, IsMongoId } from 'class-validator';
import { TransactionType } from '../../schemas/transaction.schema';

export class CreateTransactionDto {
  @IsMongoId()
  @IsNotEmpty()
  customerId: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}