import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private readonly customersService: CustomersService) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async generateMonthlyBills() {
    this.logger.log('Generating monthly bills for all active customers...');
    
    try {
      await this.customersService.generateMonthlyBills();
      this.logger.log('Monthly bills generated successfully');
    } catch (error) {
      this.logger.error('Failed to generate monthly bills', error.stack);
    }
  }

  async generateBillsManually() {
    this.logger.log('Manually generating monthly bills...');
    await this.customersService.generateMonthlyBills();
    return { message: 'Monthly bills generated successfully' };
  }
}