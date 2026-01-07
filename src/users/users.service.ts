import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) throw new ConflictException('El email ya está registrado.');

    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        role: Role.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
      },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findById(id);

    return await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    return await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
      select: {
        id: true,
        email: true,
      },
    });
  }
}
