import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialProducts } from './data/products';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}
  async seedProducts() {
    const { products } = initialProducts;
    await this.productService.removeAll();
    const productPromises = [];
    products.forEach((product) => {
      product.price = Math.round(product.price);
      productPromises.push(this.productService.create(product));
    });
    await Promise.all(productPromises);
  }
}
