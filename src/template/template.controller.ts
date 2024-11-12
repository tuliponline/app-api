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
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { SuccessResponse } from 'src/responses/success.response';

@ApiTags('Template')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto, @Request() req) {
    return this.templateService.create(createTemplateDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Request() req,
  ): Promise<SuccessResponseWithMeta> {
    return this.templateService.findAll(page, limit, req.user.userId);
  }

  @Get('/example')
  async findAllAdmin(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<SuccessResponseWithMeta> {
    return this.templateService.findAllAdmin(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req,
    @Query('filters') filters?: string,
  ): Promise<SuccessResponse> {
    return this.templateService.findOne(req.user.userId, id, filters);
  }

  @Get('app/:app')
  findBySlug(@Param('app') app: string): Promise<SuccessResponse> {
    return this.templateService.findByApp(app);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @Request() req,
  ) {
    return this.templateService.update(req.user.userId, id, updateTemplateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.templateService.remove(req.user.userId, id);
  }
}
