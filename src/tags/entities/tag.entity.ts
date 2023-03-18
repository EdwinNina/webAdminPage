import { Post } from "src/posts/entities/post.entity";
import { BaseEntity } from "src/shared/base.entity";
import { Column, Entity, BeforeInsert, BeforeUpdate, ManyToMany } from "typeorm";

@Entity('tags')
export class Tag extends BaseEntity{
   @Column('varchar', { length: 100, unique: true })
   title: string;

   @Column('varchar', { length: 100, unique: true })
   slug: string;

   @Column('boolean', { default: true })
   status: boolean;

   @ManyToMany(
      () => Post,
      (post) => post.tags
   )
   posts: Post[]

   @BeforeInsert()
   transformInputsInsert(){
      this.title = this.title.trim().toLowerCase();
      this.slug = this.title.toLowerCase().replaceAll(' ', '-');
   }

   @BeforeUpdate()
   transformInputsUpdate(){
      this.transformInputsInsert()
   }
}