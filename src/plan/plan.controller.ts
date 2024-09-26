import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { AdminStrategy } from 'src/auth/strategies/admin.strategy';
// import { AdminGuard } from '../auth/strategies/admin.guards';

@ApiTags('plan')
@Controller('plan')
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AdminStrategy)
  @Post()
  async create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<SuccessResponseWithMeta> {
    return this.planService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const plan = await this.planService.findOne(id);
    if (!plan) {
      throw new NotFoundException('planId not found');
    }
    return this.planService.findOne(id);
  }

  @UseGuards(AdminStrategy)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    const plan = await this.planService.findOne(id);
    if (!plan) {
      throw new NotFoundException('planId not found');
    }

    return this.planService.update(id, updatePlanDto);
  }

  @UseGuards(AdminStrategy)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const plan = await this.planService.findOne(id);
    if (!plan) {
      throw new NotFoundException('planId not found');
    }

    return this.planService.remove(id);
  }
}
