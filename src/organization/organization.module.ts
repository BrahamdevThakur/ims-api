import { Module } from '@nestjs/common';
import { OrganizationsService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { PrismaService } from 'src/prisma/prisma.services';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationsService, PrismaService],
})
export class OrganizationModule {}
