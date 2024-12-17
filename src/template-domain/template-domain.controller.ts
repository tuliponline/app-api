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
  Request,
} from '@nestjs/common';
import { TemplateDomainService } from './template-domain.service';
import { CreateTemplateDomainDto } from './dto/create-template-domain.dto';
import { UpdateTemplateDomainDto } from './dto/update-template-domain.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { SuccessResponse } from 'src/responses/success.response';

@ApiTags('template-domain')
@Controller('template-domain')
export class TemplateDomainController {
  constructor(private readonly templateDomainService: TemplateDomainService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTemplateDomainDto: CreateTemplateDomainDto) {
    return this.templateDomainService.create(createTemplateDomainDto);
  }

  @Get()
  async findWithPagination(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filters') filters?: string,
  ): Promise<SuccessResponseWithMeta> {
    console.log('getTemplateDomainMember :', new Date());
    return this.templateDomainService.findWithPagination(page, limit, filters);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponse> {
    return this.templateDomainService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() UpdateTemplateDomainDto: UpdateTemplateDomainDto,
    @Request() req,
  ) {
    return this.templateDomainService.update(req.user.userId, id, UpdateTemplateDomainDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateDomainService.remove(id);
  }
}
