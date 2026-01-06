import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { generateSlug } from 'src/common/utils/slug.utils';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  automateSlug() {
    if (this.name) {
      this.slug = generateSlug(this.name);
    }
  }
}
