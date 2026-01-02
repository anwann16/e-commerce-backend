import {
  Controller,
  // Get,
  Post,
  Body,
  HttpStatus,
  Get,
  UseGuards,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './entities/login.dto';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { BaseResponseDto, ResponseHelper } from '../../common/responses';
import { UserResponseDto } from '../users/dto/response/user-response.dto';
import { JwtGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('/login')
  async login(
    @Body() request: LoginDto,
  ): Promise<BaseResponseDto<{ accessToken: string }>> {
    const loginResponse = await this.authService.login(request);
    console.log(request);
    return ResponseHelper.success(
      loginResponse,
      'User logged in successfully',
      HttpStatus.OK,
    );
  }

  @UseGuards(JwtGuard)
  @Get('/tes')
  findAll() {
    return 'This action returns all auth';
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
