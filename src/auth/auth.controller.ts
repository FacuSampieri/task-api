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
import { LocalAuthGuard } from './guards/local-auth.guard';

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
}
