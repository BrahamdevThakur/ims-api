import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.services';

@Module({
  controllers: [UsersController],
  providers: [UsersService,PrismaService],
})
export class UsersModule {}
