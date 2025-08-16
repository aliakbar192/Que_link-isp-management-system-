import { Module } from '@nestjs/common';

import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [CustomersModule],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}