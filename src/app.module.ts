import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),PrismaModule,AuthModule,UsersModule, TasksModule, FilesModule],
})
export class AppModule {}
