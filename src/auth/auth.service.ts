import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Registro de usuario
  async register(data: RegisterDto) {
    const { email, password, name, lastName, phone } = data;
    
    const exists = await this.prisma.user.findUnique({
      where: { email },
    });
    if (exists) {
      throw new UnauthorizedException('El email ya está registrado.');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, password: hashed, name, lastName, phone },
    });

    return this.generateTokens(user);
  }

  // Validación de usuario
  async validateUser(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta.');
    }

    return user;
  }

  // Login de usuario
  async login(usuario: User) {
    return this.generateTokens(usuario);
  }

  // Generación de tokens JWT
  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
      },
    };
  }
}
