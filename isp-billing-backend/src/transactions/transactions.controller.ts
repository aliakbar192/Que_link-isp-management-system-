import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApproveTransactionDto } from './dto/approve-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/system-user.schema';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(createTransactionDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get('pending')
  @Roles(UserRole.SUPER_ADMIN)
  findPending() {
    return this.transactionsService.findPending();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Post('approve')
  @Roles(UserRole.SUPER_ADMIN)
  approve(@Body() approveTransactionDto: ApproveTransactionDto, @Request() req) {
    return this.transactionsService.approve(approveTransactionDto, req.user.id);
  }

  @Get('reports/daily')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  getDailyCollectionReport(@Query('date') date: string) {
    return this.transactionsService.getDailyCollectionReport(date);
  }

  @Get('reports/monthly')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  getMonthlyCollectionReport(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.transactionsService.getMonthlyCollectionReport(year, month);
  }
}