import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { Priority } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService {
	constructor(
		private readonly tasksService: TasksService,
		private readonly usersService: UsersService,
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
}
