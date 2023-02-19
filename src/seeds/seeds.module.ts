import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';
import { TagsModule } from 'src/tags/tags.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  controllers: [SeedsController],
  providers: [SeedsService],
  imports: [TagsModule, CategoriesModule]
})
export class SeedsModule {}
