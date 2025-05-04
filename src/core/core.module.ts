import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dropdown, Dropdownschema } from 'src/schemas/dropdown.schema';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dropdown.name, schema: Dropdownschema }])],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}