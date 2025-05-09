import { BadRequestException, Body, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, UpdateStockDto } from '../dto/stock.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Types } from 'mongoose';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}



  @Get('/getstock')
  async getStocks(
    @Query('search') searchQuery: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('stock_id') stock_id: string, // <-- Accept stock_id as query param
  ) {
    return this.stockService.getStock(stock_id,searchQuery,page, limit);
  }


  @Get('/searchStock')
  async searchStocks(
    @Query('search') searchQuery: string,
  ) {
    return this.stockService.searchStocks(searchQuery);
  }
  
  // @Patch('/updatestock')
  // async updateStock(
  //   @Query('id') id: string,
  //   @Body() updateStockDto: UpdateStockDto,
  // ) {
  //   return this.stockService.updateStock(id, updateStockDto);
  // }

  @Post('/importStock')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return cb(new BadRequestException('Only Excel files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async importStock(@UploadedFile() file,@Body() request) {
    const filter = request
    return this.stockService.importStock(file.path,filter);
  }

  @Put('update-stock/:id')
  async updateStock(
    @Param('id') id: string,
    @Body() updateDto: UpdateStockDto,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid stock ID');
    }
    return this.stockService.updateStock(id, updateDto);
  }
  
}
