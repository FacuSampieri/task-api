import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('groups')
@ApiBearerAuth('access-token')
@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}


  @Post()
  @ApiOperation({ summary: 'Crear un nuevo grupo' })
  @ApiResponse({ status: 201, description: 'Grupo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    const userId = req.user.id;
    return this.groupsService.create(createGroupDto, userId);
  }


  @Get()
  @ApiOperation({ summary: 'Obtener todos los grupos del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de grupos obtenida exitosamente.' })
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.groupsService.findAll(userId);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Obtener un grupo por ID' })
  @ApiResponse({ status: 200, description: 'Grupo obtenido exitosamente.' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.groupsService.findOne(id, userId);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un grupo por ID' })
  @ApiResponse({ status: 200, description: 'Grupo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto, @Request() req) {
    const userId = req.user.id;
    return this.groupsService.update(id, updateGroupDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un grupo por ID' })
  @ApiResponse({ status: 200, description: 'Grupo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.groupsService.remove(id, userId);
  }
}
