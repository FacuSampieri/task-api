import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Priority, Status } from '@prisma/client';

@Controller('tasks')
@ApiTags('tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea para el usuario autenticado' })
  @ApiBody({ type: CreateTaskDto, description: 'Datos de la nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada correctamente' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId = req.user.id;
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todas las tareas (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Listado de tareas' })
  @ApiForbiddenResponse({ description: 'No tienes permiso (se requiere rol ADMIN)' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  @ApiResponse({ status: 200, description: 'Listado de tareas filtradas', schema: { example: [] } })
  @ApiQuery({ name: 'status', required: false, enum: Status, description: 'Estado de la tarea' })
  @ApiQuery({ name: 'priority', required: false, enum: Priority, description: 'Prioridad de la tarea' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'ID del usuario' })
  // Filtros por query params: /tasks?status=pending&priority=HIGH&userId=xxx
  findAll(
    @Query('status') status?: Status,
    @Query('priority') priority?: Priority,
    @Query('userId') userId?: string
  ) {
    return this.tasksService.findAll(status, priority, userId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Listar tareas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de tareas del usuario', schema: { example: [] } })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  @ApiQuery({ name: 'priority', required: false, enum: Priority, description: 'Prioridad de la tarea' })
  @ApiQuery({ name: 'status', required: false, enum: Status, description: 'Estado de la tarea' })
  @ApiQuery({ name: 'groupId', required: false, type: String, description: 'ID del grupo' })
  findAllByUser(
    @Request() req,
    @Query('priority') priority?: Priority,
    @Query('status') status?: Status,
    @Query('groupId') groupId?: string,
  ) {
    const userId = req.user.id;
    return this.tasksService.findAllByUser(userId, priority, status, groupId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID (propia o ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: 'string' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea (propia o ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID de la tarea a actualizar', type: 'string' })
  @ApiBody({ type: UpdateTaskDto, description: 'Campos a actualizar' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada correctamente' })
  @ApiForbiddenResponse({ description: 'No tienes permiso para modificar esta tarea' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    const userId = req.user.id;
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea (propia o ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID de la tarea a eliminar', type: 'string' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  @ApiForbiddenResponse({ description: 'No tienes permiso para eliminar esta tarea' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.tasksService.remove(id, userId);
  }
}
