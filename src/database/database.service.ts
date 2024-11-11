import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class DatabaseService {
  private users: User[] = [];
  private tracks: Track[] = [];

  // USERS
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

  // TRACKS
  getAllTracks(): Track[] {
    return this.tracks;
  }

  createTrack(track: Partial<Track>): Track {
    const newTrack = new Track({ id: uuidv4(), ...track });
    this.tracks.push(newTrack);

    return newTrack;
  }

  findTrackById(id: string): Track {
    const track = this.tracks.find((t) => t.id === id);
    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  updateTrack(id: string, updatedFields: Partial<Track>): Track {
    const track = this.findTrackById(id);
    Object.assign(track, updatedFields);

    return track;
  }

  deleteTrack(id: string): void {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) throw new NotFoundException('Track not found');

    this.tracks.splice(index, 1);
  }
}
