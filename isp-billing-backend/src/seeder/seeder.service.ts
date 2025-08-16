import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly authService: AuthService) {}

  async seed() {
    try {
      // Create SuperAdmin user
      await this.authService.createSuperAdmin('admin', 'admin123');
      this.logger.log('SuperAdmin user created successfully');
      
      return { message: 'Database seeded successfully' };
    } catch (error) {
      if (error.message.includes('already exists')) {
        this.logger.log('SuperAdmin user already exists');
        return { message: 'Database already seeded' };
      }
      this.logger.error('Failed to seed database', error.stack);
      throw error;
    }
  }
}