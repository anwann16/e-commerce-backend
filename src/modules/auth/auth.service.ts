import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginDto } from './entities/login.dto';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { UserResponseDto } from '../users/dto/response/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(request: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.createUser(request);
  }

  async login(request: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findByEmail(request.email);

    const isPasswordValid = await this.comparePassword(
      request.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token };
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

  private async comparePassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashPassword);
  }
}
