import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { FilesModule } from './files/files.module';
import { GroupsModule } from './groups/groups.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),PrismaModule,AuthModule,UsersModule, TasksModule, FilesModule, GroupsModule, TelegramModule],
})
export class AppModule {}
