import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [],
})
export class CategoryModule {}
