import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'New title of the book (optional)' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'New author of the book (optional)' })
  author?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'New published date (optional)',
    example: '10/10/2024',
  })
  publishedDate?: string;
}
