import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Implementar autenticación', description: 'Título de la tarea' })
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Implementar autenticación usando JWT', description: 'Descripción de la tarea', required: false })
    description?: string;

    @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
    @IsOptional()
    @ApiProperty({ example: 'MEDIUM', description: 'Prioridad de la tarea', required: false })
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    @ApiProperty({ example: '2025-12-31', description: 'Fecha de vencimiento de la tarea', required: false })
    dueDate?: Date;
}
