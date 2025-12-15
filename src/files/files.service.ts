import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { File as MulterFile } from 'multer';
import * as fs from 'fs';

@Injectable()
export class FilesService {
    constructor(private prisma: PrismaService) {}

    async uploadFile(taskId: string, file: MulterFile, userId: string) {
        const { task, user } = await this.findUserAndTask(taskId, userId);

        if (user.role !== 'ADMIN' && task.userId !== userId) {
            throw new Error('You do not have permission to upload files to this task');
        }

        const storedFile = await this.prisma.taskFile.create({
            data: {
                fileName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype,
                taskId: taskId,
            },
        });

        return storedFile;
    }

    async getFiles(taskId: string, userId: string) {
        const { task, user } = await this.findUserAndTask(taskId, userId);

        if (user.role !== 'ADMIN' && task.userId !== userId) {
            throw new Error('You do not have permission to view files of this task');
        }

        const files = await this.prisma.taskFile.findMany({
            where: { taskId },
        });

        return files;
    }

    async downloadFile(fileId: string, userId: string) {
        const file = await this.prisma.taskFile.findUnique({
            where: { id: fileId },
        });

        if (file === null) {
            throw new Error('File not found');
        }

        const { task, user } = await this.findUserAndTask(file.taskId, userId);

        if (user.role !== 'ADMIN' && task.userId !== userId) {
            throw new Error('You do not have permission to download this file');
        }

        return {
            file,
            stream: fs.createReadStream(file.path),
        };
    }

    async deleteFile(fileId: string, userId: string) {
        const file = await this.prisma.taskFile.findUnique({
            where: { id: fileId },
        });

        if (file === null) {
            throw new Error('File not found');
        }

        const { task, user } = await this.findUserAndTask(file.taskId, userId);

        if (user.role !== 'ADMIN' && task.userId !== userId) {
            throw new Error('You do not have permission to delete this file');
        }

        return this.prisma.taskFile.delete({
            where: { id: fileId },
        });
    }

    // funciones auxiliares
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
