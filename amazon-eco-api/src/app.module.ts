import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';
import { WasteItemsModule } from './waste-items/waste-items.module';
import { ManifestsModule } from './manifests/manifests.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ManifestosModule } from './manifestos/manifestos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CompaniesModule,
    WasteItemsModule,
    ManifestsModule,
    UsersModule,
    AuthModule,
    ManifestosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}