import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { envPaths } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      envFilePath: envPaths.PRODUCT,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
