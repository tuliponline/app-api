import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateStartQuestDto } from './dto/create-start-quest.dto';
import { Model } from 'mongoose';
import { StartQuest, StartQuestDocument } from './schemas/start-quest.schema';
import { SuccessResponse } from 'src/responses/success.response';

@Injectable()
export class StartQuestService {
  constructor(
    @InjectModel(StartQuest.name)
    private startQuestModel: Model<StartQuestDocument>,
  ) {}
  async create(
    createStartQuestDto: CreateStartQuestDto,
    userId: string,
  ): Promise<SuccessResponse> {
    // check duplicate

    const result = await this.startQuestModel
      .findOne({ userId, for: createStartQuestDto.for })
      .exec();
    if (result) {
      throw new ConflictException('already exists');
    }

    const newStartQuest = new this.startQuestModel({
      ...createStartQuestDto,
      userId,
    });
    await newStartQuest.save();
    return new SuccessResponse(null);
  }

  async findByUserId(userId: string): Promise<SuccessResponse> {
    const resule = await this.startQuestModel.findOne({ userId }).exec();
    if (!resule) {
      throw new NotFoundException('userId not found');
    }
    return new SuccessResponse(resule);
  }
}
