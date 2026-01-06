import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { generateSlug } from 'src/common/utils/slug.utils';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryResponseDto } from './dto/response/category-response.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(
    request: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const newSlug = generateSlug(request.name);
    const existingCategory = await this.categoryRepository.findByNameOrSlug(
      request.name,
    );

    if (existingCategory) {
      throw new ConflictException(
        'Category with the same name or slug already exists',
      );
    }
    return await this.categoryRepository.createCategory({
      name: request.name,
      slug: newSlug,
    });
  }

  async findAllCategories(): Promise<CategoryResponseDto[]> {
    return await this.categoryRepository.findAll();
  }

  async findByNameOrSlug(
    identifier: string,
  ): Promise<CategoryResponseDto | null> {
    const category = await this.categoryRepository.findByNameOrSlug(identifier);

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
  }

  async updateCategoryById(
    id: string,
    updateData: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const updatedCategory = await this.categoryRepository.updateById(
      id,
      updateData,
    );

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
    };
  }

  async deleteCategoryById(id: string): Promise<void> {
    await this.categoryRepository.deleteById(id);
  }
}
