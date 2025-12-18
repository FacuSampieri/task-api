import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        user: {
          connect: { id: userId },
        },
      }
    });
    return task;
  }

  async findAll(status?: string, priority?: string, userId?: string) {
    const tasks = await this.prisma.task.findMany();

    if (userId) {
      return tasks.filter(task => task.userId === userId);
    }

    if (status) {
      return tasks.filter(task => task.status === status);
    }

    if (priority) {
      return tasks.filter(task => task.priority === priority);
    }

    if (userId && status) {
      return tasks.filter(task => task.userId === userId && task.status === status);
    }

    if (userId && priority) {
      return tasks.filter(task => task.userId === userId && task.priority === priority);
    }

    if (status && priority) {
      return tasks.filter(task => task.status === status && task.priority === priority);
    }

    if (userId && status && priority) {
      return tasks.filter(task => task.userId === userId && task.status === status && task.priority === priority);
    }

    if (tasks === null) {
      throw new Error('No tasks found');
    }

    return tasks;
  }

  async findAllByUser(userId: string, priority?: string, status?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tasks: true },
    });

    if (user === null) {
      throw new Error('User not found');
    }

    if (user.tasks === null) {
      throw new Error('No tasks found for this user');
    }

    let filteredTasks = user.tasks;

    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    return filteredTasks;
  }

  async findOne(id: string, userId: string) {
    const { task, user } = await this.findUserAndTask(id, userId);

    if (user.role !== 'ADMIN' && task.userId !== userId) {
      throw new Error('You do not have permission to view this task');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const { task, user } = await this.findUserAndTask(id, userId);

    if (user.role !== 'ADMIN' && task.userId !== userId) {
      throw new Error('You do not have permission to update this task');
    }

    return await this.prisma.task.update({
      where: { id },
      data: { ...updateTaskDto },
    });
  }

  async remove(id: string, userId: string) {
    const { task, user } = await this.findUserAndTask(id, userId);

    if (user.role !== 'ADMIN' && task.userId !== userId) {
      throw new Error('You do not have permission to delete this task');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }

  // Funciones complementarias
    async findUserAndTask(taskId: string, userId: string) {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
  
      if (task === null) {
        throw new Error('Task not found');
      }
  
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (user === null) {
        throw new Error('User not found');
      }
  
      return { task, user };
    }
}
