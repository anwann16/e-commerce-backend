import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { AdminSeederService } from 'src/common/seeds/seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository, AdminSeederService],
  exports: [UserService],
})
export class UserModule {}
