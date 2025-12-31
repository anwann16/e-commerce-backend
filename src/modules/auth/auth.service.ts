import { Injectable } from '@nestjs/common';

import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { UserResponseDto } from '../users/dto/response/user-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async create(request: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.createUser(request);
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
