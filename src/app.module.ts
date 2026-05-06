import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { CompaniesModule } from './companies/companies.module';
import { WasteItemsModule } from './waste-items/waste-items.module';
import { ManifestsModule } from './manifests/manifests.module';

@Module({
  imports: [CompaniesModule, WasteItemsModule, ManifestsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
