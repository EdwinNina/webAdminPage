import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { v4 as uuid } from 'uuid';

export class CreateTagDto {
   @IsNotEmpty()
   @IsString()
   title: string;
}
