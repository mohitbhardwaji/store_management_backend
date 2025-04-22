// src/cart/cart.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { AddToCartDto, UpdateCartDto } from '../dto/cart.dto';
import { CartController } from './cart.controller';

@Injectable()
export class CartService {
    
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>
) {}

  async addToCart(userId: string, product: AddToCartDto) {
    const existingCart = await this.cartModel.findOne({ userId });

    if (existingCart) {
      const productIndex = existingCart.products.findIndex(
        (p) => p.productId === product.productId,
      );

      if (productIndex > -1) {
        existingCart.products[productIndex].quantity += product.quantity;
      } else {
        existingCart.products.push(product);
      }

      return existingCart.save();
    } else {
      const newCart = new this.cartModel({
        userId,
        products: [product],
      });
      return newCart.save();
    }
  }

  async getCartByUserId(userId: string) {
    return this.cartModel.findOne({ userId });
  }


  async removeProduct(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });
  
    if (!cart) {
      throw new Error('Cart not found');
    }
  
    cart.products = cart.products.filter((p) => p.productId !== productId);
  
    return cart.save();
  }

  async updateCartItem(userId: string, dto: UpdateCartDto) {
    const cart = await this.cartModel.findOne({ userId });
  
    if (!cart) throw new Error('Cart not found');
  
    const index = cart.products.findIndex((p) => p.productId === dto.productId);
  
    if (index === -1) throw new Error('Product not found in cart');
  
    if (dto.quantity !== undefined) {
      cart.products[index].quantity = dto.quantity;
    }
  
    if (dto.customPrice !== undefined) {
      cart.products[index].customPrice = dto.customPrice;
    }
  
    return cart.save();
  }


  async deleteUserCart(userId: string) {
    console.log("Deleting carts for userId:", userId);
    const result = await this.cartModel.deleteMany({ userId });
    return {
      message: 'Cart records deleted successfully',
      deletedCount: result.deletedCount,
    };
  }
}
