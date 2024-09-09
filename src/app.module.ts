import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [RolesModule, PrismaModule, OrganizationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
