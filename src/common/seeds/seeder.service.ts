import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

import { Role } from '../enums/role.enum';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AdminSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeederService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin(): Promise<void> {
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
