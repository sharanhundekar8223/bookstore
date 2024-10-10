import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  HttpCode,
  UseGuards
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UrcGaurd } from 'src/auth/urc-gaurd';
import { AuthGaurd } from 'src/auth/auth-gaurd';

@ApiTags('books')
@Controller('books')
@UseGuards(UrcGaurd, AuthGaurd)
export class BooksController {
  logger = new Logger('BooksController');

  constructor(private readonly booksService: BooksService) { }

  @Post()
  @ApiOperation({ summary: 'Creates a new book' })
  @ApiResponse({ status: 201, description: 'The book created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreateBookDto })
  async create(
    @Body() createBookDto: CreateBookDto,
    @Headers('urc') urc: string,
  ) {
    this.logger.log(
      `BooksController :: create :: ${urc} :: Request data :: ${JSON.stringify(createBookDto)}`,
    );
    return await this.booksService.create(createBookDto, urc);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: 200,
    description: 'The book details.',
    type: CreateBookDto,
  })
  @ApiResponse({ status: 404, description: 'Books not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(@Headers('urc') urc: string) {
    this.logger.log(`BooksController :: findAll :: ${urc}}`);
    return await this.booksService.findAll(urc);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiResponse({
    status: 200,
    description: 'The book details.',
    type: CreateBookDto,
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the book to retrieve',
    type: Number,
  })
  async findOne(@Param('id') id: string, @Headers('urc') urc: string) {
    this.logger.log(
      `BooksController :: findOne :: ${urc} :: Request data :: ${id}}`,
    );
    return await this.booksService.findOne(id, urc);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update book by ID' })
  @ApiResponse({
    status: 204,
    description: 'The book has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @ApiBody({ type: UpdateBookDto })
  @ApiParam({
    name: 'id',
    description: 'ID of the book to update',
    type: Number,
  })
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @Headers('urc') urc: string,
  ): Promise<void> {
    this.logger.log(
      `BooksController :: update :: ${urc} :: Request Data :: ${updateBookDto} :: ${id}}`,
    );
    await this.booksService.update(id, updateBookDto, urc);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete book by ID' })
  @ApiResponse({
    status: 204,
    description: 'The book has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the book to delete',
    type: Number,
  })
  @HttpCode(204)
  async remove(
    @Param('id') id: string,
    @Headers('urc') urc: string,
  ): Promise<void> {
    this.logger.log(
      `BooksController :: remove :: ${urc} :: Request Data :: ${id}}`,
    );
    await this.booksService.remove(id, urc);
  }
}
