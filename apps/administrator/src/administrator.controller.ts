import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import mongoose from 'mongoose';
import { ValidateParamIDDto } from '@app/common';
import { Administrator } from './schemas/administrator.schema';
import { AdministratorService } from './administrator.service';
import { JwtAuthGuard } from '@app/common/auth';

@Controller('administrators')
export class AdministratorController {
  private readonly logger = new Logger();
  constructor(private readonly administratorService: AdministratorService) {}

  @Get()
  async getAdministrators(): Promise<Administrator[]> {
    return await this.administratorService.getAdministrators({});
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAdministrator(
    @Param() { id }: ValidateParamIDDto,
  ): Promise<Administrator> {
    return await this.administratorService.getAdministrator({
      _id: new mongoose.Types.ObjectId(id),
    });
  }
}
