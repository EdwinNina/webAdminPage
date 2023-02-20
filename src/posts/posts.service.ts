import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { handleErrorDbLog } from 'helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { ImagesService } from 'src/images/images.service';
import { Tag } from 'src/tags/entities/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { isUUID } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {

  private cloudinary_folder: string = 'post-images'

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private imageService: ImagesService,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ){}

  async create(createPostDto: CreatePostDto, image: Express.Multer.File, user: User) {
    try {
      const [resultImage, tagsIds] = await Promise.all([
        this.imageService.uploadImage(image, this.cloudinary_folder),
        this.tagsRepository.findBy({ id: In(createPostDto.tags) })
      ])
      const post = await this.postRepository.create(createPostDto)
      post.image = resultImage.secure_url
      post.tags = tagsIds
      post.user = user;

      return await this.postRepository.save(post)
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;
    const posts = await this.postRepository.find({
      take: limit,
      skip: offset
    });

    return {
      data: posts
    }
  }

  async findOne(query: string) {
    let post: Post;

    if(isUUID(query)){
      post = await this.postRepository.findOneBy({ id: query })
    }else{
      const query_builder = this.postRepository.createQueryBuilder('post')
      post = await query_builder.where('UPPER(post.title) = :title or post.slug =:slug', {
        title: query.toUpperCase(),
        slug: query.toLowerCase()
      })
      .leftJoinAndSelect('post.category', 'category')
      .getOne()
    }

    if(!post) throw new NotFoundException(`Post not found with term ${query}`)

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, image: Express.Multer.File) {
    try {
      const post = await this.postRepository.preload({id, ...updatePostDto});

      if(!post) throw new NotFoundException(`Post not found with id: ${id}`)

      if(image){
        const [upload, remove] = await Promise.all([
          this.imageService.uploadImage(image, this.cloudinary_folder),
          this.imageService.deleteImage(post.image, this.cloudinary_folder)
        ])
        post.image = upload.secure_url
        if(!remove) throw new BadRequestException("Hubo un error al remover la imagen del almacenamiento");
      }

      return await this.postRepository.save(post)
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  // private async getPostUser(id: string, user: User){
  //   const query_builder = await this.postRepository.createQueryBuilder('post')

  //   const post = await query_builder.where('post.id = :id AND post.user = :user', {
  //     id,
  //     user: user.id
  //   }).getOne()

  //   if(!post) throw new NotFoundException(`Post not found with id ${id} and user ${user.id}`);

  //   return post
  // }

  // async deletePost(id: string, user: User){
  //   try {
  //     const post = await this.getPostUser(id, user)
  //     const [remove] = await Promise.all([
  //       this.imageService.deleteImage(post.image, this.cloudinary_folder),
  //       this.postRepository.remove(post)
  //     ])
  //     if(!remove) throw new BadRequestException("Hubo un error al remover la imagen del almacenamiento");
  //   } catch (error) {
  //     handleErrorDbLog(error)
  //   }
  // }

  async likePostByUser(post_id: string, user: User){
    try {
      const post = await this.findOne(post_id)
      post.likePosts = [user]

      await this.postRepository.save(post)

      return {
        ok: true,
        message: 'Le diste me gusta a este post ' + post.title
      }
    } catch (error) {
      handleErrorDbLog(error)
    }
  }
}
