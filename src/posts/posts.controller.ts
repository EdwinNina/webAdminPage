import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/active-roles.interface';
import { LikePostDto } from './dto/like-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth(ValidRoles.admin, ValidRoles.blogger)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new FileTypeValidator({ fileType: 'jpg|jpeg|png' }),
        ]
      })
    ) image: Express.Multer.File,
    @GetUser() user: User
  ) {
    return this.postsService.create(createPostDto, image, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('query') query: string) {
    return this.postsService.findOne(query);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: 'jpg|jpeg|png'})
        ]
      })
    ) image: Express.Multer.File
  )
  {
    return this.postsService.update(id, updatePostDto, image);
  }

  @Auth(ValidRoles.user)
  @Post('likePost')
  likePost(
    @Body() likePostDto: LikePostDto,
    @GetUser() user: User
  ){
    return this.postsService.likePostByUser(likePostDto.post_id, user)
  }

  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.postsService.remove(id);
  // }
}
