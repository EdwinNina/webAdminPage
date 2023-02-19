import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
  imports: [ConfigModule]
})
export class ImagesModule {}
