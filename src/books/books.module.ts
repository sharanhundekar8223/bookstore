import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { BookGateway } from './book.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]), // Registers the Book entity in TypeORM
  ],
  controllers: [BooksController], // BooksController handles HTTP requests
  providers: [BooksService, BookGateway], // Provides service and WebSocket gateway
})
export class BooksModule {}
