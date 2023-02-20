import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ImagesModule } from 'src/images/images.module';
import { TagsModule } from 'src/tags/tags.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    TypeOrmModule.forFeature([Post]),
    ImagesModule,
    TagsModule,
    AuthModule
  ],
})
export class PostsModule {}
