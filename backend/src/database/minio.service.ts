import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import * as fs from 'fs';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private readonly bucketName = 'sme-invoices';
  private host: string;
  private port: number;

  constructor() {
    const isDocker = fs.existsSync('/.dockerenv');
    this.host = isDocker ? 'host.docker.internal' : 'localhost';
    this.port = 9000;

    this.logger.log(`Connecting to MinIO Object Storage at ${this.host}:${this.port} using primary credentials...`);
    this.minioClient = new Minio.Client({
      endPoint: this.host,
      port: this.port,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadminpassword',
    });
  }

  async onModuleInit() {
    try {
      this.logger.log(`Checking if MinIO bucket "${this.bucketName}" exists (Primary Credentials)...`);
      await this.initBucket();
    } catch (err) {
      const errMsg = err.message || '';
      if (
        errMsg.includes('Access Key Id') || 
        errMsg.includes('SignatureDoesNotMatch') || 
        errMsg.includes('InvalidAccessKeyId') ||
        errMsg.includes('credential')
      ) {
        this.logger.warn(`MinIO connection with primary credentials failed: ${errMsg}. Trying fallback credentials "admin/admin1234"...`);
        this.minioClient = new Minio.Client({
          endPoint: this.host,
          port: this.port,
          useSSL: false,
          accessKey: 'admin',
          secretKey: 'admin1234',
        });
        
        try {
          await this.initBucket();
        } catch (fallbackErr) {
          this.logger.error(`MinIO connection with fallback credentials failed: ${fallbackErr.message}`);
        }
      } else {
        this.logger.error(`MinIO initialization failed: ${errMsg}`);
      }
    }
  }

  private async initBucket() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      this.logger.log(`Bucket "${this.bucketName}" does not exist. Creating it...`);
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      
      const publicPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };
      await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(publicPolicy));
      this.logger.log(`Bucket "${this.bucketName}" created and set to PUBLIC READ.`);
    } else {
      this.logger.log(`Bucket "${this.bucketName}" already exists.`);
    }
  }

  /**
   * Uploads file buffer to MinIO bucket and returns the browser-accessible URL.
   */
  async uploadFile(fileName: string, buffer: Buffer, contentType: string): Promise<string> {
    try {
      this.logger.log(`Uploading file ${fileName} to MinIO bucket "${this.bucketName}"...`);
      await this.minioClient.putObject(this.bucketName, fileName, buffer, buffer.length, {
        'content-type': contentType,
      });
      
      const fileUrl = `http://localhost:9000/${this.bucketName}/${fileName}`;
      this.logger.log(`Upload successful. Public URL: ${fileUrl}`);
      return fileUrl;
    } catch (err) {
      this.logger.error(`Failed to upload file to MinIO: ${err.message}`);
      throw err;
    }
  }

  getClient(): Minio.Client {
    return this.minioClient;
  }
}
