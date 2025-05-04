import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CoreService } from "./core.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateDropdownDto } from "src/dto/stock.dto";

@UseGuards(JwtAuthGuard)
@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService
  ) {}

  @Post('dropdown')
  async createDropdown(@Body() dto: CreateDropdownDto) {
    return this.coreService.createOrUpdateDropdown(dto);
  }

  // GET: Get dropdown values by key
  @Get('dropdown/:key')
  async getDropdown(@Param('key') key: string) {
    return this.coreService.getDropdownByKey(key);
  }
}