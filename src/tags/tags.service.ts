import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { handleErrorDbLog } from 'helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ){}

  async create(createTagDto: CreateTagDto) {
    try {
      const tag = await this.tagRepository.create(createTagDto)
      return await this.tagRepository.save(tag)
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;
    const tags = await this.tagRepository.find({
      take: limit,
      skip: offset
    })

    return {
      data: tags
    }
  }

  async findOne(id: string) {
    const tag = await this.tagRepository.findOneBy({ id })
    if(!tag) throw new NotFoundException(`Tag with id ${id} not found`)

    return tag
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    await this.findOne(id)
    try {
      const tag = await this.tagRepository.preload({id, ...updateTagDto})
      return await this.tagRepository.save(tag)
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async changeStatus(id: string) {
    try {
      const tag = await this.findOne(id)
      tag.status = !tag.status
      await this.tagRepository.update(id, tag)

      return tag;
    } catch (error) {
      handleErrorDbLog(error)
    }
  }
}
