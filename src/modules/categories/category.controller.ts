import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Role } from 'src/common/enums/role.enum';
import { CategoryService } from './category.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { BaseResponseDto, ResponseHelper } from 'src/common/responses';
import { CategoryResponseDto } from './dto/response/category-response.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  async createCategory(
    @Body() request: CreateCategoryDto,
  ): Promise<BaseResponseDto<CategoryResponseDto>> {
    const category = await this.categoryService.createCategory(request);
    return ResponseHelper.success(category, 'Category created successfully');
  }

  @Get()
  @Public()
  async findAllCategories(): Promise<BaseResponseDto<CategoryResponseDto[]>> {
    const categories = await this.categoryService.findAllCategories();
    return ResponseHelper.success(
      categories,
      'Categories fetched successfully',
    );
  }

  @Get(':identifier')
  async findCategoryByNameOrSlug(
    @Param('identifier') identifier: string,
  ): Promise<BaseResponseDto<CategoryResponseDto | null>> {
    const category = await this.categoryService.findByNameOrSlug(identifier);
    return ResponseHelper.success(category, 'Category fetched successfully');
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async updateCategoryById(
    @Param('id') id: string,
    @Body() updateData: CreateCategoryDto,
  ): Promise<BaseResponseDto<CategoryResponseDto>> {
    const category = await this.categoryService.updateCategoryById(
      id,
      updateData,
    );
    return ResponseHelper.success(category, 'Category updated successfully');
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteCategoryById(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<null>> {
    await this.categoryService.deleteCategoryById(id);
    return ResponseHelper.success(null, 'Category deleted successfully');
  }
}
