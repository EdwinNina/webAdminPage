import {IsString, IsNotEmpty, IsUUID, IsBooleanString , IsArray} from 'class-validator'
import { Category } from '../../categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Transform } from 'class-transformer';

export class CreatePostDto {

   @IsNotEmpty()
   @IsString()
   title: string;

   @IsNotEmpty()
   @IsString()
   extract: string;

   @IsNotEmpty()
   @IsString()
   description: string;

   @IsNotEmpty()
   @Transform(({ obj, key }) => obj[key] === 'true')
   published: boolean;

   @IsNotEmpty()
   @IsUUID()
   category: Category;

   @IsNotEmpty()
   @IsUUID(4, { each: true})
   @IsArray()
   tags: Tag[]
}
