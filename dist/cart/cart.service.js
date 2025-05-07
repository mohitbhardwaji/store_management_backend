"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cart_schema_1 = require("../schemas/cart.schema");
const mongoose_2 = require("mongoose");
let CartService = class CartService {
    cartModel;
    constructor(cartModel) {
        this.cartModel = cartModel;
    }
    async addToCart(userId, product) {
        const existingCart = await this.cartModel.findOne({ userId });
        if (existingCart) {
            const productIndex = existingCart.products.findIndex((p) => p.productId === product.productId);
            if (productIndex > -1) {
                existingCart.products[productIndex].quantity += product.quantity;
            }
            else {
                existingCart.products.push(product);
            }
            return existingCart.save();
        }
        else {
            const newCart = new this.cartModel({
                userId,
                products: [product],
            });
            return newCart.save();
        }
    }
    async getCartByUserId(userId) {
        return this.cartModel.findOne({ userId });
    }
    async removeProduct(userId, productId) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = cart.products.filter((p) => p.productId !== productId);
        return cart.save();
    }
    async updateCartItem(userId, dto) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart)
            throw new Error('Cart not found');
        const index = cart.products.findIndex((p) => p.productId === dto.productId);
        if (index === -1)
            throw new Error('Product not found in cart');
        if (dto.quantity !== undefined) {
            cart.products[index].quantity = dto.quantity;
        }
        if (dto.customPrice !== undefined) {
            cart.products[index].customPrice = dto.customPrice;
        }
        return cart.save();
    }
    async deleteUserCart(userId) {
        console.log("Deleting carts for userId:", userId);
        const result = await this.cartModel.deleteMany({ userId });
        return {
            message: 'Cart records deleted successfully',
            deletedCount: result.deletedCount,
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CartService);
//# sourceMappingURL=cart.service.js.map