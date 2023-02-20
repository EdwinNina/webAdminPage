import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { etiquetas } from 'prisma/data/etiquetas';
import { convertStringInSlugFormat } from '../../helpers/index';
import { Repository } from 'typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { categorias } from 'prisma/data/categorias';
import { Category } from 'src/categories/entities/category.entity';
import { Role } from 'src/roles/entities/role.entity';
import { roles } from 'prisma/data/roles';


@Injectable()
export class SeedsService {

   constructor(
      @InjectRepository(Tag)
      private tagRepository: Repository<Tag>,
      @InjectRepository(Category)
      private categoryRepository: Repository<Category>,
      @InjectRepository(Role)
      private roleRepository: Repository<Role>,
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

   async insertRolesDB(){
      const rolesDB = await this.roleRepository.find();

      if(rolesDB.length){
         const roleIds = rolesDB.map( role => role.id )
   
         await this.roleRepository.createQueryBuilder()
            .delete()
            .from(Role)
            .where('id IN (:...id)', { id: roleIds })
            .execute();
      }
      roles.map(async role => {
         const { name, description } = role
         const nuevoRole = this.roleRepository.create({
            name,
            description
         })
         await this.roleRepository.save(nuevoRole)
      })

      return {
         'mensaje': 'Datos insertados correctamente'
      }
   }
}

