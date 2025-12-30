import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.service';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: AppLogger,
  ) {}

  onModuleInit() {
    if (!this.dataSource.isInitialized) {
      throw new Error('❌ Database connection failed');
    }

    this.logger.info('Database connected successfully');
  }
}
