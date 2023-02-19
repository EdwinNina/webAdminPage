import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { etiquetas } from 'prisma/data/etiquetas';
import { convertStringInSlugFormat } from '../../helpers/index';
import { Repository } from 'typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { categorias } from 'prisma/data/categorias';
import { Category } from 'src/categories/entities/category.entity';


@Injectable()
export class SeedsService {

   constructor(
      @InjectRepository(Tag)
      private tagRepository: Repository<Tag>,
      @InjectRepository(Category)
      private categoryRepository: Repository<Category>,
   ) {}

   async insertDataDB(){
      const tags = await this.tagRepository.find();
      if(tags.length){
         const tagIds = tags.map( tag => tag.id )
   
         await this.tagRepository.createQueryBuilder()
            .delete()
            .from(Tag)
            .where('id IN (:...id)', { id: tagIds })
            .execute();
      }

      const categoria = await this.categoryRepository.find();

      if(categoria.length){
         const categoriaIds = categoria.map( categoria => categoria.id )
         await this.categoryRepository.createQueryBuilder()
            .delete()
            .from(Category)
            .where('id IN (:...id)', { id: categoriaIds })
            .execute();
      }

      etiquetas.map(async etiqueta => {
         const { title } = etiqueta
         const newTag = this.tagRepository.create({
            title,
            slug: convertStringInSlugFormat(title)
         })
         await this.tagRepository.save(newTag)
      })

      categorias.map(async categoria => {
         const { title } = categoria
         const nuevaCategoria = this.categoryRepository.create({
            title,
            slug: convertStringInSlugFormat(title)
         })
         await this.categoryRepository.save(nuevaCategoria)
      })

      return {
         'mensaje': 'Datos insertados correctamente'
      }
   }
}
