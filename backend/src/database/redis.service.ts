import { Injectable, OnModuleInit, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import * as fs from 'fs';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;
  private host: string;
  private port: number;

  constructor() {
    const isDocker = fs.existsSync('/.dockerenv');
    this.host = isDocker ? 'host.docker.internal' : 'localhost';
    this.port = 6379;
    const password = 'SecretRedis123'; // User requested password

    this.logger.log(`Connecting to Redis at ${this.host}:${this.port} using primary password...`);
    this.redisClient = new Redis({
      host: this.host,
      port: this.port,
      password,
      maxRetriesPerRequest: 1, // Minimize retry delay for fallback detection
      lazyConnect: true,
    });
  }

  async onModuleInit() {
    // Suppress unhandled error events in Node process
    this.redisClient.on('error', (err) => {
      this.logger.debug(`Redis background error: ${err.message}`);
    });

    try {
      this.logger.log('Testing Redis connection with PING (Primary Password)...');
      await this.redisClient.connect();
      const response = await this.redisClient.ping();
      this.logger.log(`Redis ping response: ${response}`);
    } catch (err) {
      this.logger.warn(`Redis connection with primary password failed: ${err.message}. Trying fallback password "admin1234"...`);
      
      try {
        this.redisClient.disconnect();
      } catch {}

      this.redisClient = new Redis({
        host: this.host,
        port: this.port,
        password: 'admin1234',
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.redisClient.on('error', (fallbackErr) => {
        this.logger.debug(`Redis fallback background error: ${fallbackErr.message}`);
      });

      try {
        await this.redisClient.connect();
        const response = await this.redisClient.ping();
        this.logger.log(`Redis ping response (Fallback Password): ${response}`);
      } catch (fallbackErr) {
        this.logger.error(`Redis connection with fallback password failed: ${fallbackErr.message}`);
      }
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from Redis...');
    this.redisClient.disconnect();
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<string> {
    if (expireSeconds) {
      return this.redisClient.set(key, value, 'EX', expireSeconds);
    }
    return this.redisClient.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}
