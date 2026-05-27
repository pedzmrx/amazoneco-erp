import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ManifestosModule } from './manifestos/manifestos.module'; 
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    ManifestosModule, CompaniesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}