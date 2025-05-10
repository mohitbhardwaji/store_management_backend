import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateSalesExecutiveDto } from '../dto/create-sales-executive.dto';
import { SalesExecutive, SalesExecutiveDocument } from '../schemas/sales-executive.schema';

@Injectable()
export class SalesExecutiveService {
  constructor(
    @InjectModel(SalesExecutive.name)
    private salesExecutiveModel: Model<SalesExecutiveDocument>,
  ) {}

  async create(dto: CreateSalesExecutiveDto) {
    try {
      const existing = await this.salesExecutiveModel.findOne({
        $or: [{ email: dto.email }, { mobileNumber: dto.mobileNumber }],
      });
      if (existing) {
        throw new ConflictException('Sales executive with email or mobile number already exists');
      }

      const created = new this.salesExecutiveModel(dto);
      return await created.save();
    } catch (err) {
      if (err instanceof ConflictException) throw err;
      throw new InternalServerErrorException('Failed to create sales executive');
    }
  }

  async findAll(id?: string) {
    try {
      const search: any = { isDeleted: false };
  
      if (id) {
        search._id = id;
      }
  
      const result = await this.salesExecutiveModel.find(search).sort({ createdAt: -1 });
  
      if (id && result.length === 0) {
        throw new NotFoundException('Sales executive not found or has been deleted');
      }
  
      return result;
    } catch (error) {
        if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch sales executive(s)');
    }
  }
  

  async softDelete(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid sales executive ID');
    }

    const executive = await this.salesExecutiveModel.findById(id);
    if (!executive || executive.isDeleted) {
      throw new NotFoundException('Sales executive not found or already deleted');
    }

    try {
      executive.isDeleted = true;
      await executive.save();
      return { message: 'Sales executive soft-deleted successfully' };
    } catch {
      throw new InternalServerErrorException('Failed to soft delete sales executive');
    }
  }

 
  
}
