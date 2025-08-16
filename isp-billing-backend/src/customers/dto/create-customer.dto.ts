import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { CustomerStatus } from '../../schemas/customer.schema';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  package: string;

  @IsNumber()
  @Min(0)
  monthlyAmount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(CustomerStatus)
  @IsOptional()
  status?: CustomerStatus;
}