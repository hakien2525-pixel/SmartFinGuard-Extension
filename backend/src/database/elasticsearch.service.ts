import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import * as fs from 'fs';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name);
  private esClient: Client;

  constructor() {
    const isDocker = fs.existsSync('/.dockerenv');
    const host = isDocker ? 'host.docker.internal' : 'localhost';
    const port = 9200;
    const node = `http://${host}:${port}`;

    this.logger.log(`Connecting to Elasticsearch at ${node}...`);
    this.esClient = new Client({
      node,
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Testing Elasticsearch connection with info()...');
      const info = await this.esClient.info();
      this.logger.log(`Elasticsearch connected. Cluster Name: ${info.cluster_name}, Version: ${info.version.number}`);
    } catch (err) {
      this.logger.error(`Elasticsearch connection failed: ${err.message}`);
      // Do not crash the app, but log error clearly
    }
  }

  getClient(): Client {
    return this.esClient;
  }

  async indexDocument(index: string, id: string, document: any) {
    try {
      return await this.esClient.index({
        index,
        id,
        document,
      });
    } catch (err) {
      this.logger.error(`Failed to index document in Elasticsearch: ${err.message}`);
    }
  }

  async searchDocuments(index: string, query: any) {
    try {
      return await this.esClient.search({
        index,
        query,
      });
    } catch (err) {
      this.logger.error(`Failed to search documents in Elasticsearch: ${err.message}`);
      return { hits: { hits: [] } };
    }
  }
}
