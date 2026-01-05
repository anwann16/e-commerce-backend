import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';

import { UserService } from './user.service';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
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

  @Roles(Role.USER)
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
