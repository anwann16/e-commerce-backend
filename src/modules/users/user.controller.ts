import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { UserService } from './user.service';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { BaseResponseDto, ResponseHelper } from 'src/common/responses';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll(
    @Param('page') page = '1',
    @Param('limit') limit = '10',
  ): Promise<BaseResponseDto<UserResponseDto[]>> {
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const { data, total } = await this.userService.findAll(
      pageNumber,
      limitNumber,
    );

    return ResponseHelper.list(data, total, pageNumber, limitNumber);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.userService.findById(id);

    return ResponseHelper.success(user, 'User retrieved successfully');
  }

  @Patch(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const updatedUser = await this.userService.updateById(id, updateUserDto);
    return ResponseHelper.success(updatedUser, 'User updated successfully');
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BaseResponseDto<null>> {
    await this.userService.deleteById(id);
    return ResponseHelper.success(null, 'User deleted successfully');
  }
}
