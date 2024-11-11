import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { Track } from 'src/track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';

@Injectable()
export class DatabaseService {
  private users: User[] = [];
  private tracks: Track[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];

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

  // ARTISTS
  getAllArtists(): Artist[] {
    return this.artists;
  }

  findArtistById(id: string): Artist {
    return this.artists.find((a) => a.id === id);
  }

  createArtist(artist: Partial<Artist>): Artist {
    const newArtist = new Artist(artist);
    this.artists.push(newArtist);

    return newArtist;
  }

  updateArtist(id: string, updatedFields: Partial<Artist>): Artist {
    const artist = this.findArtistById(id);
    if (!artist) throw new NotFoundException(`Artist with ID ${id} not found`);

    Object.assign(artist, updatedFields);

    return artist;
  }

  deleteArtist(id: string): void {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) throw new NotFoundException('Artist not found');

    this.artists.splice(index, 1);
    this.tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    this.albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
  }
}
