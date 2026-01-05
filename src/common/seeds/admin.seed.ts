// src/database/seeds/admin.seed.ts
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { Role } from '../enums/role.enum';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AdminSeed implements OnModuleInit {
  private readonly logger = new Logger(AdminSeed.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createAdminIfNotExists();
  }

  private async createAdminIfNotExists(): Promise<void> {
    const adminExists = await this.userRepository.exists({
      where: { role: Role.ADMIN },
    });

    if (adminExists) {
      this.logger.log('Admin already exists, skipping seed');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    const admin = this.userRepository.create({
      email: process.env.ADMIN_EMAIL!,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await this.userRepository.save(admin);

    this.logger.warn('Admin user created successfully');
  }
}
