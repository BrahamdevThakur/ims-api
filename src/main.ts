import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './guards/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  //app instance is created Here
  const app = await NestFactory.create(AppModule, { cors: true });

  //all Middlewares are registered here
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard(new JwtService(), new Reflector()));

  //application start
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
