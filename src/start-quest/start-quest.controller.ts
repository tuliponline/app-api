import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StartQuestService } from './start-quest.service';
import { CreateStartQuestDto } from './dto/create-start-quest.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('start-quest')
@Controller('start-quest')
export class StartQuestController {
  constructor(private readonly startQuestService: StartQuestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createStartQuestDto: CreateStartQuestDto, @Request() req) {
    return this.startQuestService.create(createStartQuestDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Request() req) {
    const startQuest = this.startQuestService.findByUserId(req.user.userId);
    return startQuest;
  }
}
