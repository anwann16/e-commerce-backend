import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../auth/decorators/public.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BaseResponseDto, ResponseHelper } from 'src/common/responses';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Public()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  @Public()
  async findAll(@Query() query: PaginationDto): Promise<BaseResponseDto> {
    const { products, total, page, limit } =
      await this.productsService.findAll(query);

    return ResponseHelper.list(products, total, page, limit);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findProductById(id);

    return ResponseHelper.success(product, 'Successfully get product');
  }

  @Patch(':id')
  @Public()
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);

    return ResponseHelper.success(null, 'Delete Success');
  }
}
