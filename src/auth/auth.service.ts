import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    const user = await this.users.createUser({
      email: data.email,
      password: data.password,
      name: data.name,
      lastName: data.lastName,
      phone: data.phone,
    });

    return this.generateTokens(user);
  }

  async validateUser({ email, password }: LoginDto) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    return user;
  }

  async login(user) {
    return this.generateTokens(user);
  }

  async refreshToken(user: any) {
    return this.generateTokens(user);
  }

  private async generateTokens(user) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwt.sign(payload, {
      expiresIn: '15m',
    });

    const refresh_token = this.jwt.sign(payload, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET') || this.config.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });

    // Guardar el refresh token en la base de datos
    await this.users.updateRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}

