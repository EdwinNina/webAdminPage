import { IsUUID, IsNotEmpty } from 'class-validator';

export class LikePostDto {
   @IsNotEmpty()
   @IsUUID()
   post_id: string;
}