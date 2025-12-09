import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com', description: "Email del usuario" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Password123', description: "Contraseña del usuario" })
  password: string;
}
