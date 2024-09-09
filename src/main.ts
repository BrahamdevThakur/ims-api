import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //app instance is created Here 
  const app = await NestFactory.create(AppModule);

  //all Middlewares are registered here 
  app.useGlobalPipes(new ValidationPipe());

  //application start
  await app.listen(3000);
}
bootstrap();
