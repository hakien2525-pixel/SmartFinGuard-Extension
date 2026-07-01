import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;
  private primaryConnectionString: string;
  private fallbackConnectionString: string;

  constructor() {
    const isDocker = fs.existsSync('/.dockerenv');
    const defaultHost = isDocker ? 'host.docker.internal' : 'localhost';
    
    // Primary credentials as requested by user
    this.primaryConnectionString = process.env.DATABASE_URL || `postgresql://admin:SecretPassword123@${defaultHost}:5432/sme_finance_db`;
    // Fallback credentials in case the local database is still using postgres/admin1234
    this.fallbackConnectionString = `postgresql://postgres:admin1234@${defaultHost}:5432/sme_finance_db`;

    this.logger.log(`Initializing PostgreSQL connection with primary credentials...`);
    this.pool = new Pool({
      connectionString: this.primaryConnectionString,
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Testing PostgreSQL connection with primary credentials...');
      await this.pool.query('SELECT 1');
      this.logger.log('PostgreSQL connected successfully (Primary Credentials).');
    } catch (err) {
      const errMsg = err.message || '';
      if (
        errMsg.includes('password authentication failed') || 
        errMsg.includes('auth') || 
        errMsg.includes('FATAL')
      ) {
        this.logger.warn(`PostgreSQL primary connection failed: ${errMsg}. Trying fallback credentials...`);
        try {
          await this.pool.end();
        } catch {}

        this.pool = new Pool({
          connectionString: this.fallbackConnectionString,
        });

        try {
          await this.pool.query('SELECT 1');
          this.logger.log('PostgreSQL connected successfully (Fallback Credentials).');
        } catch (fallbackErr) {
          this.logger.error(`PostgreSQL connection failed with fallback credentials: ${fallbackErr.message}`);
          throw fallbackErr;
        }
      } else {
        this.logger.error(`PostgreSQL connection failed: ${errMsg}`);
        throw err;
      }
    }

    // Run Database Migration from independent SQL file (⚡ DevOps rule requirement)
    try {
      let sqlPath = path.resolve(__dirname, '..', '..', 'database', 'migrations', '01_init_schema.sql');
      if (!fs.existsSync(sqlPath)) {
        // Fallback for compiled dist structure
        sqlPath = path.resolve(__dirname, '..', '..', '..', 'database', 'migrations', '01_init_schema.sql');
      }

      this.logger.log(`Reading database migration from: ${sqlPath}`);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      this.logger.log('Executing database schema migrations...');
      await this.pool.query(sql);
      this.logger.log('Database schema migrations completed successfully.');
    } catch (err) {
      this.logger.error('Failed to run database migrations:', err.message);
      throw err;
    }
  }

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }

  async getPool() {
    return this.pool;
  }
}
