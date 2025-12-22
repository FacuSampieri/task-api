import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto, userId: string) {
    return this.prisma.group.create({
      data: {
        name: createGroupDto.name,
        color: createGroupDto.color,
        userId: userId,
      },
    });
  }

  async findAll(userId: string) {
    const user = await this.validateUser(userId);
    const groups = await this.prisma.group.findMany({
      where: { userId: userId },
    });

    if (!groups) {
      throw new Error('No groups found for this user');
    }

    return groups;
  }

  async findOne(id: string, userId: string) {
    const user = await this.validateUser(userId);

    const group = await this.prisma.group.findUnique({
      where: { id: id },
    });

    if (!group || group.userId !== userId) {
      throw new Error('Group not found or access denied');
    }

    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto, userId: string) {
    const user = await this.validateUser(userId);

    const group = await this.prisma.group.findUnique({
      where: { id: id },
    });

    if (!group || group.userId !== userId) {
      throw new Error('Group not found or access denied');
    }

    return this.prisma.group.update({
      where: { id: id },
      data: {
        name: updateGroupDto.name,
        color: updateGroupDto.color,
      },
    });
  }

  async remove(id: string, userId: string) {
    const user = await this.validateUser(userId);

    const group = await this.prisma.group.findUnique({
      where: { id: id },
    });

    if (!group || group.userId !== userId) {
      throw new Error('Group not found or access denied');
    }

    return this.prisma.group.delete({
      where: { id: id },
    });
  }

  // funciones auxiliares
  validateUser(userId: string) {
    const user = this.prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
