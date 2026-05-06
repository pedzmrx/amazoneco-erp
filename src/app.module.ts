import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { CompaniesModule } from './companies/companies.module';
import { WasteItemsModule } from './waste-items/waste-items.module';
import { ManifestsModule } from './manifests/manifests.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule,CompaniesModule, WasteItemsModule, ManifestsModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
