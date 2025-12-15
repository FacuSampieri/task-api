import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener información del usuario logueado' })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario logueado',
    schema: {
      example: {
        id: 'uuid-string',
        email: 'user@example.com',
        name: 'John',
        lastName: 'Doe',
        phone: '2616116235',
        height: null,
        weight: null,
        createdAt: '2025-12-11T12:00:00Z',
        updatedAt: '2025-12-11T12:00:00Z',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  getMe(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todos los usuarios (solo ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los usuarios',
    schema: {
      example: [
        {
          id: 'uuid-string',
          email: 'user@example.com',
          name: 'John',
          lastName: 'Doe',
          phone: '2616116235',
        },
      ],
    },
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso (se requiere rol ADMIN)',
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Obtener información de un usuario específico (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario solicitado',
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiForbiddenResponse({
    description: 'No tienes permiso (se requiere rol ADMIN)',
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar información del usuario' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a actualizar',
    type: 'string',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Datos a actualizar (todos opcionales)',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para modificar este usuario',
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @Request() req,
  ) {
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      throw new Error('No tienes permiso para modificar este usuario');
    }

    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar un usuario (solo ADMIN)' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a eliminar',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiForbiddenResponse({
    description: 'No tienes permiso (se requiere rol ADMIN)',
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}

