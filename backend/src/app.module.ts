import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiService } from './gemini.service';
import { DatabaseModule } from './database/database.module';
import { ForensicModule } from './forensics/forensic.module';

@Module({
  imports: [
    DatabaseModule,
    ForensicModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeminiService],
})
export class AppModule {}
