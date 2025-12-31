import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/request/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UserResponseDto } from './dto/response/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly SALT_ROUNDS = 10;

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private async comparePassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashPassword);
  }

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
}
// findAll() {
//   return `This action returns all users`;
// }

// findOne(id: number) {
//   return `This action returns a #${id} user`;
// }

// update(id: number, updateUserDto: UpdateUserDto) {
//   return `This action updates a #${id} user`;
// }

// remove(id: number) {
//   return `This action removes a #${id} user`;
// }
