// src/app.module.ts
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BillModule } from './bill/bill.module';
import { StockModule } from './stock/stock.module';
import { CoreModule } from './core/core.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { FinanceModule } from './finance/finance.module';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { SalesExecutiveController } from './sales-executive/sales-executive.controller';
import { SalesExecutiveModule } from './sales-executive/sales-executive.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI')!,
      }),
    }),
    AuthModule,
    BillModule,
    StockModule,
    CoreModule,
    FinanceModule,
    ProductsModule,
    SalesExecutiveModule,
  ],
  controllers: [ProductsController, SalesExecutiveController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
