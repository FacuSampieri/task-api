import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CreateGroupDto {
    @ApiProperty({ example: 'Trabajo', description: 'Nombre del grupo' })
    @IsString()
    @Length(1, 100)
    name: string;

    @ApiProperty({ example: '#f87171', description: 'Color en formato hexadecimal (#RRGGBB)' })
    @IsString()
    @Matches(/^#[0-9A-Fa-f]{6}$/)
    color: string;
}
