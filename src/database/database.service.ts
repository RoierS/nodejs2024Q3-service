import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { Track } from 'src/track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { Favorites } from 'src/favorites/entities/favorites.entity';

export type FavoriteType = 'artists' | 'albums' | 'tracks';

@Injectable()
export class DatabaseService {
  private users: User[] = [];
  private tracks: Track[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];
  private favorites: Favorites = new Favorites();

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
    if (!user) throw new NotFoundException('User not found');

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
    this.removeFromFavorites(id, 'tracks');
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
    this.removeFromFavorites(id, 'artists');
  }

  // ALBUMS
  getAllAlbums(): Album[] {
    return this.albums;
  }

  findAlbumById(id: string): Album {
    const album = this.albums.find((a) => a.id === id);
    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  createAlbum(albumData: CreateAlbumDto): Album {
    const newAlbum = new Album({ id: uuidv4(), ...albumData });
    this.albums.push(newAlbum);

    return newAlbum;
  }

  updateAlbum(id: string, updatedFields: Partial<Album>): Album {
    const album = this.findAlbumById(id);
    if (!album) throw new NotFoundException(`Album with ID ${id} not found`);

    Object.assign(album, updatedFields);

    return album;
  }

  deleteAlbum(id: string): void {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) throw new NotFoundException('Album not found');

    this.albums.splice(index, 1);
    this.removeFromFavorites(id, 'albums');
    this.tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });
  }

  // FAVORITES

  getAllFavorites() {
    return {
      artists: this.favorites.artists.map((id) =>
        this.artists.find((artist) => artist.id === id),
      ),
      albums: this.favorites.albums.map((id) =>
        this.albums.find((album) => album.id === id),
      ),
      tracks: this.favorites.tracks.map((id) =>
        this.tracks.find((track) => track.id === id),
      ),
    };
  }

  addFavorite(type: FavoriteType, id: string) {
    if (!this.validateEntityExists(type, id)) {
      throw new UnprocessableEntityException(
        `${type.slice(0, -1)} with ID ${id} not found`,
      );
    }

    if (!this.favorites[type].includes(id)) {
      this.favorites[type].push(id);
    } else {
      throw new BadRequestException(
        `${type.slice(0, -1)} with ID ${id} already in favorites`,
      );
    }
  }

  private removeFromFavorites(id: string, type: FavoriteType) {
    const index = this.favorites[type].indexOf(id);
    if (index !== -1) this.favorites[type].splice(index, 1);
  }

  removeFavorite(type: FavoriteType, id: string) {
    const index = this.favorites[type].indexOf(id);
    if (index === -1)
      throw new NotFoundException(
        `${type.slice(0, -1)} with ID ${id} is not in favorites`,
      );
    this.favorites[type].splice(index, 1);
  }

  private validateEntityExists(type: FavoriteType, id: string): boolean {
    switch (type) {
      case 'artists':
        return !!this.artists.find((artist) => artist.id === id);
      case 'albums':
        return !!this.albums.find((album) => album.id === id);
      case 'tracks':
        return !!this.tracks.find((track) => track.id === id);
      default:
        return false;
    }
  }
}
