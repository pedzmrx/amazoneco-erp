import { Module } from '@nestjs/common';
import { WasteItemsService } from './waste-items.service';
import { WasteItemsController } from './waste-items.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WasteItemsController],
  providers: [WasteItemsService],
})
export class WasteItemsModule {}