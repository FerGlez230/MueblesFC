import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../common/handlers/error-handler';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { PriceHelper } from 'src/common/helpers/prices.helper';

@Injectable()
export class ProductsService {
  private readonly context = 'Product';
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly errorHandler: ErrorHandler,
    private readonly priceHelper: PriceHelper,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }
  async findAll(options: IPaginationOptions): Promise<Pagination<Product>> {
    const queryResults = await paginate<Product>(
      this.productRepository,
      options,
    );
    const items = queryResults.items.map((item) => this.setFinalProduct(item));
    return { ...queryResults, items };
  }
  async findByCategory(category: string, options: IPaginationOptions) {
    const queryBuilder = this.productRepository.createQueryBuilder('p');
    queryBuilder.where('p.category = :category', { category });
    const queryResults = await paginate<Product>(queryBuilder, options);
    const items = queryResults.items.map((item) => this.setFinalProduct(item));
    return { ...queryResults, items };
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product)
        throw new NotFoundException(
          `${ErrorMessages.MISSING_OBJECT} el producto`,
        );
      return this.setFinalProduct(product);
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    try {
      await this.productRepository.update(id, updateProductDto);
      return this.setFinalProduct({ ...product, ...updateProductDto });
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      return await this.productRepository.delete(id);
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  setFinalProduct(product: Product) {
    return {
      ...product,
      shortTermPrice: this.priceHelper.getShortTermPayment(product.price),
      longTermPrice: this.priceHelper.getLongTermPayment(product.price),
    };
  }
}
