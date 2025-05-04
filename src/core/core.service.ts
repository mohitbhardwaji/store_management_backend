import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from 'mongoose';
import { CreateDropdownDto } from "src/dto/stock.dto";
import { Dropdown } from "src/schemas/dropdown.schema";

@Injectable()
export class CoreService {
    
  constructor(
    @InjectModel(Dropdown.name) private dopdownModel: Model<Dropdown>
) {}

async createOrUpdateDropdown(dto: CreateDropdownDto) {
    const existing = await this.dopdownModel.findOne({ key: dto.key });
    if (existing) {
      existing.value = dto.values;
      return existing.save();
    }
    return this.dopdownModel.create(dto);
  }

  async getDropdownByKey(key: string) {
    const dropdown = await this.dopdownModel.findOne({ key });
    if (!dropdown) {
      throw new NotFoundException(`Dropdown for key "${key}" not found`);
    }
    return dropdown;
  }

}