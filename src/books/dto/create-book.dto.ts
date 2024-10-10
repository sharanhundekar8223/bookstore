import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Title of the book' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Author of the book' })
  author: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'date published', example: '10/10/2024' })
  publishedDate: string;
}
