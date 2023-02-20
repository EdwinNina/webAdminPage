import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, JoinTable, ManyToMany, CreateDateColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Post } from 'src/posts/entities/post.entity';

@Entity('users')
export class User{

   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('varchar', { length: 100 })
   username: string;

   @Column('varchar', { unique: true, length: 60 })
   email: string;

   @Column('varchar', {length: 70 })
   password: string;

   @Column('boolean', { default: true })
   isActive: boolean;

   @OneToMany(
      () => Post,
      (post) => post.user
   )
   post: Post;

   @JoinTable({
      name: 'users_roles',
      joinColumn: {
         name: 'user_id',
      },
      inverseJoinColumn: {
         name: 'role_id'
      }
   })
   @ManyToMany(
      () => Role,
      ( role ) => role.users,
      { eager: true }
   )
   roles: Role[];


   @ManyToMany(
      () => Post,
      ( post ) => post.likePosts,
   )
   favoritePosts: Post[];

   @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
   created_at: Date;

   @CreateDateColumn({ name: 'updated_at' })
   updatedAt: Date;

   @BeforeInsert()
   checkInputsInsert(){
      this.username = this.username.trim().toLowerCase()
      this.email = this.email.trim().toLowerCase()
   }

   @BeforeUpdate()
   checkInputsUpdate(){
      this.checkInputsInsert()
   }
}