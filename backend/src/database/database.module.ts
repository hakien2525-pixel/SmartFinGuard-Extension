import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RedisService } from './redis.service';
import { MinioService } from './minio.service';
import { ElasticsearchService } from './elasticsearch.service';

@Global()
@Module({
  providers: [
    DatabaseService,
    RedisService,
    MinioService,
    ElasticsearchService,
  ],
  exports: [
    DatabaseService,
    RedisService,
    MinioService,
    ElasticsearchService,
  ],
})
export class DatabaseModule {}
