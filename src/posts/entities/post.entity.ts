import { User } from "src/auth/entities/user.entity";
import { Category } from "src/categories/entities/category.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable, JoinColumn } from "typeorm";

@Entity('posts')
export class Post {

   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('varchar', { length: 200, unique: true })
   title: string;

   @Column('varchar', { length: 250, unique: true })
   slug: string;
   
   @Column('text')
   extract: string;

   @Column('text')
   description: string;

   @Column('varchar', { length: 150 })
   image: string;

   @Column('boolean', { default: true })
   status: boolean;

   @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
   created_at: Date;

   @ManyToOne(
      () => Category,
      (category) => category.posts,
      { eager: true }
   )
   category: Category;

   @ManyToOne(
      () => User,
      (user) => user.post,
      { eager: true }
   )
   @JoinColumn({
      name: 'user_id'
   })
   user: User

   @JoinTable({
      name: 'posts_tags',
      joinColumn: {
         name: 'post_id',
      },
      inverseJoinColumn: {
         name: 'tag_id'
      }
   })
   @ManyToMany(
      () => Tag,
      (tag) => tag.posts,
      { eager: true }
   )
   tags: Tag[]

   @JoinTable({
      name: 'posts_likes_users',
      joinColumn: {
         name: 'post_id',
      },
      inverseJoinColumn: {
         name: 'user_id'
      }
   })
   @ManyToMany(
      () => User,
      (user) => user.favoritePosts,
   )
   likePosts: User[]

   @BeforeInsert()
   checkInputsInsert(){
      this.title = this.title.toLowerCase()
      this.slug = this.title.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-')
   }

   @BeforeUpdate()
   checkInputsUpdate(){
      this.checkInputsInsert()
   }
}