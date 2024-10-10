import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Logger } from '@nestjs/common';
import { BookGateway } from './book.gateway';

@Injectable()
export class BooksService {
  logger = new Logger('BooksController');

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly bookGateway: BookGateway,
  ) {}

  async create(createBookDto: CreateBookDto, urc: string): Promise<Book> {
    const logMessage = `BooksService :: create :: ${urc}`;
    this.logger.log(logMessage);
    try {
      const book = this.bookRepository.create(createBookDto);
      const savedRec = await this.bookRepository.save(book);
      if (savedRec) {
        this.logger.log(`${logMessage} :: new book created successfully`);

        // Emit WebSocket event for book creation
        this.bookGateway.sendBookUpdate('Book Created', savedRec);
      }
      return savedRec;
    } catch (error) {
      this.logger.error(`${logMessage} :: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to create the book. Please try again later',
      );
    }
  }

  async findAll(urc: string): Promise<Book[]> {
    const logMessage = `BooksService :: findAll :: ${urc}`;
    this.logger.log(logMessage);
    try {
      const books = await this.bookRepository.find();
      return books;
    } catch (error) {
      this.logger.error(`${logMessage} :: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to fetch books. Please try again later.',
      );
    }
  }

  async findOne(id: string, urc: string): Promise<Book> {
    const logMessage = `BooksService :: findOne :: ${urc}`;
    this.logger.log(logMessage);
    try {
      const book = await this.bookRepository.findOne({ where: { id } });
      if (!book) {
        throw new NotFoundException(`Data not found`);
      }
      return book;
    } catch (error) {
      this.logger.error(`${logMessage} :: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch book. Please try again later.',
      );
    }
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
    urc: string,
  ): Promise<boolean> {
    const logMessage = `BooksService :: update :: ${urc}`;
    this.logger.log(logMessage);
    try {
      const book = await this.bookRepository.findOne({ where: { id } });
      if (!book) {
        this.logger.error(
          `${logMessage} :: Invalid ID - Book with ID :: ${id} :: not found`,
        );
        throw new NotFoundException(
          `Failed to update the book - invalid data. Please try again later.`,
        );
      }
      await this.bookRepository.update(id, updateBookDto);
      this.logger.log(`${logMessage} :: book :: ${id} :: updated successfull`);

      // Emit WebSocket event for book update
      this.bookGateway.sendBookUpdate('Book Updated', { id, ...updateBookDto });

      return true;
    } catch (error) {
      this.logger.error(`${logMessage} :: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update the book. Please try again later.',
      );
    }
  }

  async remove(id: string, urc: string): Promise<boolean> {
    const logMessage = `BooksService :: remove :: ${urc}`;
    this.logger.log(logMessage);
    try {
      const book = await this.bookRepository.findOne({ where: { id } });
      if (!book) {
        this.logger.error(
          `${logMessage} :: Invalid ID - Book with ID :: ${id} :: not found`,
        );
        throw new NotFoundException(
          `Failed to delete the book - invalid data. Please try again later.`,
        );
      }
      await this.bookRepository.delete(id);
      this.logger.log(`${logMessage} :: book :: ${id} :: deleted successfull`);

      // Emit WebSocket event for book deletion
      this.bookGateway.sendBookUpdate('Book Deleted', { id });

      return true;
    } catch (error) {
      this.logger.error(`${logMessage} :: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete the book. Please try again later.',
      );
    }
  }
}
