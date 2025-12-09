import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com', description: "Email del usuario" })
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ example: 'Password123', description: "Contraseña del usuario" })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John', description: "Nombre del usuario" })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Doe', description: "Apellido del usuario" })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2616116666', description: "Teléfono del usuario" })
  phone: string;
}
