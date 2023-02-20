import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ValidRoles } from '../auth/interfaces/active-roles.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Auth(ValidRoles.user)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tagsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Patch('changeStatus/:id')
  changeStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagsService.changeStatus(id);
  }
}
