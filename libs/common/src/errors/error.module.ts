import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ErrorMiddleware } from './error.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class ErrorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorMiddleware).forRoutes('*');
  }
}
