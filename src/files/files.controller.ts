import {
  Controller,
  Param,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Request,
  Get,
  Delete,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { File as MulterFile } from 'multer';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import express from 'express';
import * as crypto from 'crypto';
import * as fs from 'fs';

@Controller('files')
@ApiTags('files')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post(':taskId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const taskId = req.params.taskId;
          const uploadPath = join(
            process.cwd(),
            'data',
            'uploads',
            'tasks',
            taskId,
          );

          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = crypto.randomUUID() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({ summary: 'Subir un archivo para la tarea especificada' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido correctamente',
    schema: { example: { fileId: 'uuid', filename: 'document.pdf' } },
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  uploadFile(
    @Param('taskId') taskId: string,
    @UploadedFile() file: MulterFile,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.filesService.uploadFile(taskId, file, userId);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Obtener lista de archivos asociados a una tarea' })
  @ApiParam({ name: 'taskId', description: 'ID de la tarea', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Listado de archivos',
    schema: {
      example: [
        {
          fileId: 'uuid',
          filename: 'document.pdf',
          url: '/files/download/uuid',
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  getFiles(@Param('taskId') taskId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.filesService.getFiles(taskId, userId);
  }

  @Get('download/:fileId')
  @ApiOperation({ summary: 'Descargar un archivo por su ID' })
  @ApiParam({ name: 'fileId', description: 'ID del archivo', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Respuesta con el stream del archivo (octet-stream)',
  })
  @ApiNotFoundResponse({ description: 'Archivo no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  async downloadFile(
    @Param('fileId') fileId: string,
    @Request() req,
    @Res() res: express.Response,
  ) {
    const { stream, file } = await this.filesService.downloadFile(
      fileId,
      req.user.id,
    );

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
    });

    stream.pipe(res);
  }

  @Delete(':fileId')
  @ApiOperation({ summary: 'Eliminar un archivo por su ID' })
  @ApiParam({
    name: 'fileId',
    description: 'ID del archivo a eliminar',
    type: 'string',
  })
  @ApiResponse({ status: 200, description: 'Archivo eliminado correctamente' })
  @ApiNotFoundResponse({ description: 'Archivo no encontrado' })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para eliminar este archivo',
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  deleteFile(@Param('fileId') fileId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.filesService.deleteFile(fileId, userId);
  }
}
