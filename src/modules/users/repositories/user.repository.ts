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

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: UserResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });

    return { data, total };
  }
}
