import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-images.entity';
import { generateRandomId, generateSlug } from 'src/common/utils/slug.utils';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async createProduct(request: CreateProductDto) {
    const { images, category_id, name, description, price, stock } = request;
    const newSlug = generateSlug(name);

    const slugExist = await this.productRepository.findOne({
      where: { slug: newSlug },
    });

    let slugUpdated;
    if (slugExist) {
      slugUpdated = `${newSlug}-${generateRandomId(7)}`;
    }

    const product = this.productRepository.create({
      name,
      slug: slugUpdated,
      description,
      stock,
      price,
      category: { id: category_id },
    });

    await this.productRepository.save(product);

    // Simpan gambar jika ada
    if (images && images.length > 0) {
      const productImages = images.map((img) =>
        this.productImageRepository.create({
          ...img,
          product_id: product.id,
          product,
        }),
      );
      await this.productImageRepository.save(productImages);
    }

    const resultProduct = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .select([
        'product.id',
        'product.name',
        'product.slug',
        'product.price',
        'product.stock',
        'category.id',
        'category.name',
        'category.slug',
        'images.id',
        'images.image_url',
      ])
      .where('product.id = :id', { id: product.id })
      .getOne();

    return resultProduct;
  }

  async findAll(request: PaginationDto) {
    const { limit, page } = request;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .select([
        'product.id',
        'product.name',
        'product.slug',
        'product.price',
        'product.stock',
        'product.description',
        'category.id',
        'category.name',
        'category.slug',
        'images.id',
        'images.image_url',
      ]);

    const [products, total] = await queryBuilder
      .skip(skip)
      .limit(limit)
      .getManyAndCount();

    return {
      products,
      total,
      page,
      limit,
    };
  }

  async findProductById(id: string) {
    const productFound = await this.productRepository.findOne({
      where: { id },
    });

    if (!productFound) {
      throw new NotFoundException('Product Not Found');
    }

    const resultProduct = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .select([
        'product.id',
        'product.name',
        'product.slug',
        'product.price',
        'product.stock',
        'category.id',
        'category.name',
        'category.slug',
        'images.id',
        'images.image_url',
      ])
      .where('product.id = :id', { id })
      .getOne();

    return resultProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    const { name, price, stock, images, description } = updateProductDto;

    let slugUpdated;
    if (name === product.name) {
      const tempSlug = generateSlug(name);
      slugUpdated = `${tempSlug}-${generateRandomId(7)}`;
    }

    if (name && name !== product.name) {
      slugUpdated = generateSlug(name);
    }

    if (!name) {
      slugUpdated = product.slug;
    }

    await this.productRepository.update(product.id, {
      name: name || product.name,
      price: price || product.price,
      slug: slugUpdated || product.slug,
      stock: stock || product.stock,
      description: description || product.description,
      // ...(categoryToUpdate && { category: categoryToUpdate }),
    });

    if (images !== undefined) {
      await this.productImageRepository.delete({ product_id: product.id });
      if (images.length > 0) {
        const newImages = images.map((img) =>
          this.productImageRepository.create({
            ...img,
            product_id: product.id,
            product: { id: product.id } as Product,
          }),
        );
        await this.productImageRepository.save(newImages);
      }
    }

    return await this.findProductById(product.id);
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(product);
  }
}
