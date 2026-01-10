import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TasksModule, UsersModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
