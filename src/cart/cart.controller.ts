// src/cart/cart.controller.ts

import { Controller, Post, Get, Body, Req, UseGuards, Delete, Param, Patch, Logger } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from '../dto/cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService
  ) {}

  @Post()
  async addToCart(@Body() dto: AddToCartDto, @Req() req: Request) {
    const user = req.user as any;
    return this.cartService.addToCart(user.userId, dto);
  }

  @Get()
  async getUserCart(@Req() req: Request) {
    const user = req.user as any;
    return this.cartService.getCartByUserId(user.userId);
  }

  @Delete(':productId')
async removeFromCart(@Param('productId') productId: string, @Req() req: Request) {
  const user = req.user as any;
  return this.cartService.removeProduct(user.userId, productId);
}

@Patch()
async updateCart(@Body() dto: UpdateCartDto, @Req() req: Request) {
  const user = req.user as any;
  return this.cartService.updateCartItem(user.userId, dto);
}

@Delete('/empty')
  async deleteUserCart(@Req() req: Request) {
    console.log(">>> DELETE /cart/empty handler hit");
    const user = req.user as any;
    return this.cartService.deleteUserCart(user.userId);
  }
}
