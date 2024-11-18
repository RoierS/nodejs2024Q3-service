import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    const result = users.map((user) => plainToClass(User, user));

    return result;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    return plainToClass(User, user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
      },
    });

    return plainToClass(User, newUser);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Incorrect password');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: { increment: 1 },
      },
    });

    return plainToClass(User, updatedUser);
  }

  async remove(id: string): Promise<void> {
    const userToDelete = await this.prisma.user.findUnique({ where: { id } });

    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
