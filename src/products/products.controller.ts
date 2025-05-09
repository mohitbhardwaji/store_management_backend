import { BadRequestException, Body, Controller, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from 'src/dto/products.dto';
import { Product } from 'src/schemas/product.schema';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}
    @Post('create-product')
    async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
      return this.productService.createProduct(createProductDto);
    }

    @Put('update-product/:id')
    async updateProduct(
      @Param('id') id: string,
      @Body() updateDto: UpdateProductDto,
    ) {
      try {
        return await this.productService.updateProduct(id, updateDto);
      } catch (err) {
        if (err instanceof NotFoundException || err instanceof BadRequestException) {
          throw err;
        }
        throw new BadRequestException('Failed to update product');
      }
    }
}
