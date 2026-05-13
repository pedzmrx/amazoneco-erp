import { Module } from '@nestjs/common';
import { ManifestsService } from './manifests.service';
import { ManifestsController } from './manifests.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ManifestsController],
  providers: [ManifestsService],
})
export class ManifestsModule {}