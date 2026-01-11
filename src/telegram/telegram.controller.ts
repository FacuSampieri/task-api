import { Controller, Get, Patch, Param, Query, UseGuards, Post, Delete } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { N8nAuthGuard } from './guards/N8NAuthGuard.guard';
import { Priority } from '@prisma/client';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('telegram')
@ApiBearerAuth('n8n-token')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @UseGuards(N8nAuthGuard)
  @Get('users/:userId/tasks/pending')
  @ApiQuery({ name: 'priority', required: false, enum: Priority, description: 'Prioridad de la tarea' })
  @ApiQuery({ name: 'groupId', required: false, type: String, description: 'ID del grupo de Telegram' })
  getPendingTasks(
    @Param('userId') userId: string,
    @Query('priority') priority?: Priority,
    @Query('groupId') groupId?: string,
  ) {
    return this.telegramService.getPendingTasksByUser(userId, priority, groupId);
  }

  @UseGuards(N8nAuthGuard)
  @Patch('users/:userId/tasks/:taskId/complete')
  completeTask(
    @Param('userId') userId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.telegramService.completeTaskForUser(taskId, userId);
  }

  @UseGuards(N8nAuthGuard)
  @Get('users')
  getUserByTelegramId(@Query('telegramId') telegramId: string) {
    return this.telegramService.getUserByTelegramId(telegramId);
  }

  @UseGuards(N8nAuthGuard)
  @Post('users/link')
  linkTelegramIdToUser(
    @Query('email') email: string,
    @Query('telegramId') telegramId: string,
  ) {
    return this.telegramService.linkTelegramIdToUser(email, telegramId);
  }

  @UseGuards(N8nAuthGuard)
  @Post('start')
  startLinkingProcess(
    @Query('telegramId') telegramId: string,
  ) {
    return this.telegramService.startLinkingProcess(telegramId);
  }

  @UseGuards(N8nAuthGuard)
  @Get('status')
  getStatus(
    @Query('telegramId') telegramId: string,
  ) {
    return this.telegramService.getLinkingStatus(telegramId);
  }

  @UseGuards(N8nAuthGuard)
  @Delete('status')
  deleteStatus(
    @Query('telegramId') telegramId: string,
  ) {
    return this.telegramService.deleteLinkingStatus(telegramId);
  }
}
