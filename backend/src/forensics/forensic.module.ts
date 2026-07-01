import { Module } from '@nestjs/common';
import { ForensicService } from './forensic.service';

@Module({
  providers: [ForensicService],
  exports: [ForensicService],
})
export class ForensicModule {}
