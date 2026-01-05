import { Controller, Post, Body, HttpStatus, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './entities/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { BaseResponseDto, ResponseHelper } from '../../common/responses';
import { UserResponseDto } from '../users/dto/response/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(
    @Body() request: CreateUserDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.authService.register(request);
    return ResponseHelper.success(
      user,
      'User registered successfully',
      HttpStatus.CREATED,
    );
  }

  @Public()
  @Post('/login')
  async login(
    @Body() request: LoginDto,
  ): Promise<BaseResponseDto<{ accessToken: string }>> {
    const loginResponse = await this.authService.login(request);
    return ResponseHelper.success(
      loginResponse,
      'User logged in successfully',
      HttpStatus.OK,
    );
  }

  @Get('/me')
  async currentUser(
    @CurrentUser() user: UserResponseDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    return ResponseHelper.success(
      user,
      'Current user fetched successfully',
      HttpStatus.OK,
    );
  }
}
