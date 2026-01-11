import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { Priority } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramService {
	constructor(
		private readonly tasksService: TasksService,
		private readonly usersService: UsersService,
        private prisma: PrismaService,
	) {}

	async getPendingTasksByUser(userId: string, priority?: Priority, groupId?: string) {
		return this.tasksService.findAllByUser(userId, priority, 'pending', groupId);
	}

	async completeTaskForUser(taskId: string, userId: string) {
		return this.tasksService.completeTask(taskId, userId);
	}

	async getUserByTelegramId(telegramId: string) {
        return this.usersService.findByTelegramId(telegramId);
    }

    async linkTelegramIdToUser(email: string, telegramId: string) {
        return this.usersService.linkTelegramId(email, telegramId);
    }

    async startLinkingProcess(telegramId: string) {
        return await this.prisma.telegramLink.create({
            data: {
                telegramId,
                step: 'waiting_email',
            },
        });
    }

    async getLinkingStatus(telegramId: string) {
        const link = await this.prisma.telegramLink.findUnique({
            where: { telegramId },
        });

        if (!link) {
            return { status: 'not_started' };
        }

        return { status: link.step };
    }

    async deleteLinkingStatus(telegramId: string) {
        return await this.prisma.telegramLink.deleteMany({
            where: { telegramId },
        });
    }
}
