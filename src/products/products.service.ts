import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from 'src/dto/products.dto';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
      ) {}
    async createProduct(dto: CreateProductDto): Promise<Product> {
        try {
          const existing = await this.productModel.findOne({ productNumber: dto.productNumber });
          if (existing) {
            throw new ConflictException('Product with this number already exists');
          }
    
          const newProduct = new this.productModel(dto);
          return await newProduct.save();
        } catch (error) {
          if (error instanceof ConflictException) {
            throw error;
          }
          console.error('Error creating product:', error);
          throw new InternalServerErrorException('Failed to create product');
        }
      }

      async updateProduct(id: string, updateDto: UpdateProductDto): Promise<Product> {
        // Prevent productNumber change
        if ('productNumber' in updateDto) {
          throw new BadRequestException('Product number cannot be updated');
        }
    
        const updated = await this.productModel.findByIdAndUpdate(id, updateDto, {
          new: true,
        });
    
        if (!updated) throw new NotFoundException('Product not found');
        return updated;
      }
}
