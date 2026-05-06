import { PartialType } from '@nestjs/mapped-types';
import { CreateWasteItemDto } from './create-waste-item.dto';

export class UpdateWasteItemDto extends PartialType(CreateWasteItemDto) {}
