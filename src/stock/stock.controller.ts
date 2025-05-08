import { BadRequestException, Body, Controller, Get, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, UpdateStockDto } from '../dto/stock.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

// @UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}



  @Get('/getstock')
  async getStocks(
    @Query('search') searchQuery: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('id') id: string, // <-- Accept id as query param
  ) {
    return this.stockService.getStockById(id);
  }


  @Get('/searchStock')
  async searchStocks(
    @Query('search') searchQuery: string,
  ) {
    return this.stockService.searchStocks(searchQuery);
  }
  
  @Patch('/updatestock')
  async updateStock(
    @Query('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.updateStock(id, updateStockDto);
  }

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
  
}
