import { Module } from '@nestjs/common';
import { StartQuestService } from './start-quest.service';
import { StartQuestController } from './start-quest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StartQuest, StartQuestSchema } from './schemas/start-quest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StartQuest.name, schema: StartQuestSchema },
    ]),
  ],
  controllers: [StartQuestController],
  providers: [StartQuestService],
})
export class StartQuestModule {}
