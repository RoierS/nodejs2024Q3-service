import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DatabaseService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  createUser(user: Partial<User>): User {
    const newUser = new User({
      id: uuidv4(),
      ...user,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    this.users.push(newUser);

    return newUser;
  }

  findUserById(id: string): User {
    return this.users.find((u) => u.id === id);
  }

  updateUser(id: string, updatedFields: Partial<User>): User {
    const user = this.findUserById(id);
    Object.assign(user, updatedFields);
    user.version++;
    user.updatedAt = Date.now();

    return plainToClass(User, user);
  }

  deleteUser(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) throw new NotFoundException('User not found');

    this.users.splice(index, 1);
  }
}
