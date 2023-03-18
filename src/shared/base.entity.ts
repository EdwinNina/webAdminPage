import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";


export abstract class BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
   created_at: Date;

   @CreateDateColumn({ name: 'updated_at' })
   updatedAt: Date;
}