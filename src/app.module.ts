import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { Book } from './books/entities/book.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformInterceptor } from './common/response-transform.interceptor';
import { AppController } from './app.controller';
import { UrcGaurd } from './auth/urc-gaurd';
import { AuthGaurd } from './auth/auth-gaurd';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes .env variables globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Book],
        synchronize: true,
      }),
    }),
    BooksModule,
    AppModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor, // Global interceptor for response transformation
    },
    {
      provide: 'AUTH_GUARD',
      useClass: AuthGaurd, // Global guard for authentication
    },
    {
      provide: 'URC_GAULR',
      useClass: UrcGaurd, // Global guard for urc
    },
  ],
})
export class AppModule {}
