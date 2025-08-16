import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { SystemUser, UserRole } from '../schemas/system-user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SystemUser.name) private systemUserModel: Model<SystemUser>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.systemUserModel.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user._id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async createSuperAdmin(username: string, password: string) {
    const existingUser = await this.systemUserModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = new this.systemUserModel({
      username,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    });

    return superAdmin.save();
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.systemUserModel.findById(payload.sub);
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException();
      }

      const newPayload = { username: user.username, sub: user._id, role: user.role };
      
      return {
        access_token: this.jwtService.sign(newPayload),
        refresh_token: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}