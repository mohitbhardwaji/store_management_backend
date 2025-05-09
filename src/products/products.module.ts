import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { ProductsController } from './products.controller';

@Module({
    imports: [MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ])],
    controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
