import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UserResponseDto } from './dto/response/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly SALT_ROUNDS = 10;

  async createUser(request: CreateUserDto): Promise<UserResponseDto> {
    // Check if user Already exists
    const userExists = await this.userRepository.findByEmail(request.email);

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash Password
    const hashedPassword = await this.hashPassword(request.password);

    const user = await this.userRepository.createUser({
      email: request.email,
      password: hashedPassword,
    });

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: UserResponseDto[]; total: number }> {
    return await this.userRepository.findAll(page, limit);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }
}

// update(id: number, updateUserDto: UpdateUserDto) {
//   return `This action updates a #$ser`;
// }

// remove(id: number) {
//   return `This action removes a #${id} user`;
// }
