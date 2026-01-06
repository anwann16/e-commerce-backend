import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from '../entities/category.entity';
import { generateSlug } from 'src/common/utils/slug.utils';
import { CategoryResponseDto } from '../dto/response/category-response.dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    request: Partial<Category>,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.save(request);
    return category;
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    return this.categoryRepository.find();
  }

  async findByNameOrSlug(
    identifier: string,
  ): Promise<CategoryResponseDto | null> {
    return this.categoryRepository.findOne({
      where: [{ name: identifier }, { slug: identifier }],
    });
  }

  async findById(id: string): Promise<CategoryResponseDto | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async updateById(
    id: string,
    updateData: Partial<Category>,
  ): Promise<CategoryResponseDto> {
    const slug = generateSlug(updateData.name!);
    const categoryExist = await this.categoryRepository.exists({
      where: { id },
    });

    if (!categoryExist) {
      throw new Error('Category already exists');
    }

    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new Error('Category not found');
    }

    category.name = updateData.name ?? category.name;
    category.slug = slug;

    const updatedCategory = await this.categoryRepository.save(category);

    return updatedCategory;
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.categoryRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('Category not found');
    }
  }
}
