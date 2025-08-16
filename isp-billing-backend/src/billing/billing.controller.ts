import { Controller, Post, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/system-user.schema';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('generate-monthly-bills')
  @Roles(UserRole.SUPER_ADMIN)
  generateMonthlyBills() {
    return this.billingService.generateBillsManually();
  }
}