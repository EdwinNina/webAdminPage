import { User } from "src/auth/entities/user.entity";
import { BaseEntity } from "src/shared/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role extends BaseEntity{
   @Column('varchar', { length: 50, nullable: false, unique: true})
   name: string;

   @Column('varchar', { length: 150, nullable: true })
   description: string;

   @Column('boolean', { default: true })
   status: boolean;

   @ManyToMany(
      () => User,
      ( user ) => user.roles
   )
   users: User[];

   @BeforeInsert()
   checkInputInsert(){
      this.name = this.name.toLowerCase()
      this.description = this.description?.toLowerCase()
   }

   @BeforeUpdate()
   checkInputUpdate(){
      this.checkInputInsert()
   }
}