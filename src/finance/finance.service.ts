import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Finance } from '../schemas/finance.schema';
  import { CreateFinanceDto ,UpdateFinanceDto} from '../dto/finance.dto';
  
  @Injectable()
  export class FinanceService {
    constructor(
      @InjectModel(Finance.name)
      private readonly financeModel: Model<Finance>,
    ) {}
  
    async create(dto: CreateFinanceDto): Promise<Finance> {
      try {
        const finance = new this.financeModel(dto);
        return await finance.save();
      } catch (error) {
        throw new InternalServerErrorException('Failed to create finance record');
      }
    }
  
    async findAll(finance_id): Promise<Finance[]> {
      try {
        if (finance_id) {
          const finance = await this.financeModel
            .findOne({ _id: finance_id, isDeleted: false })
            .populate('stock_id');
          if (!finance) throw new NotFoundException('Finance record not found');
          return [finance];
        }
        return await this.financeModel
          .find({ isDeleted: false })
          .populate('stock_id')
          .exec();
      } catch (error) {
        throw new InternalServerErrorException('Failed to fetch finance records');
      }
    }
  
    async update(id: string, dto: UpdateFinanceDto): Promise<Finance> {
      try {
        const updated = await this.financeModel.findOneAndUpdate(
          { _id: id, isDeleted: false },
          dto,
          { new: true },
        );
        if (!updated) throw new NotFoundException('Finance record not found');
        return updated;
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new InternalServerErrorException('Failed to update finance record');
      }
    }
  
    async softDelete(id: string): Promise<{ message: string }> {
      try {
        const deleted = await this.financeModel.findOneAndUpdate(
          { _id: id, isDeleted: false },
          { isDeleted: true },
          { new: true },
        );
        if (!deleted)
          throw new NotFoundException('Finance record not found or already deleted');
        return { message: 'Finance record soft-deleted successfully' };
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new InternalServerErrorException('Failed to delete finance record');
      }
    }
  }
  