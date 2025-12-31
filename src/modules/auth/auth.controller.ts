import {
  Controller,
  // Get,
  Post,
  Body,
  HttpStatus,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { BaseResponseDto, ResponseHelper } from '../../common/responses';
import { UserResponseDto } from '../users/dto/response/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async create(
    @Body() request: CreateUserDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.authService.create(request);
    return ResponseHelper.success(
      user,
      'User registered successfully',
      HttpStatus.CREATED,
    );
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

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
