import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll(): User[] {
    return this.databaseService.getAllUsers();
  }

  findOne(id: string): User {
    const user = this.databaseService.findUserById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  create(createUserDto: CreateUserDto): User {
    return this.databaseService.createUser({
      login: createUserDto.login,
      password: createUserDto.password,
    });
  }

  updatePassword(id: string, updatePasswordDto: UpdateUserDto): User {
    const user = this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Incorrect password');
    }

    return this.databaseService.updateUser(id, {
      password: updatePasswordDto.newPassword,
    });
  }

  remove(id: string): void {
    this.databaseService.deleteUser(id);
  }
}
