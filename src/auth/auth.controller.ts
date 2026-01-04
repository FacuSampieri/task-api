import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({
    type: RegisterDto,
    description: 'Datos requeridos para registrarse',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente y retorna tokens JWT',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error de validación o email ya registrado',
    schema: {
      example: {
        statusCode: 400,
        message: 'El email ya está registrado',
      },
    },
  })
  register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales de acceso',
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso, retorna tokens JWT',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciales inválidas',
      },
    },
  })
  login(@Request() req) {
    return this.auth.login(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Token de refresco para obtener un nuevo token de acceso',
  })
  @ApiResponse({
    status: 200,
    description: 'Nuevo token de acceso generado exitosamente',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user@example.com',
          name: 'Juan',
          lastName: 'Pérez',
          role: 'USER',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o expirado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token inválido o expirado',
      },
    },
  })
  refresh(@Request() req) {
    return this.auth.refreshToken(req.user);
  }
}

