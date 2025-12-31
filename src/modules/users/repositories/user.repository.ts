import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/response/user-response.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(request: Partial<User>): Promise<UserResponseDto> {
    const user = await this.userRepository.save(request);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
