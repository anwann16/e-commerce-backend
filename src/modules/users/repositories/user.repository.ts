import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

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

  async findById(id: string): Promise<UserResponseDto | null> {
    return await this.userRepository.findOne({ where: { id } });
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

  async deleteById(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async updateById(
    id: string,
    updateData: Partial<User>,
  ): Promise<UserResponseDto> {
    const result = await this.userRepository.update(id, updateData);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.findById(id);
    return updatedUser!;
  }
}
