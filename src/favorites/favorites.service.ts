import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { FavoriteType } from '../database/database.service';
import { FavoriteAlbum, FavoriteArtist, FavoriteTrack } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFavorites() {
    const [tracks, albums, artists] = await Promise.all([
      this.prisma.favoriteTrack.findMany(),
      this.prisma.favoriteAlbum.findMany(),
      this.prisma.favoriteArtist.findMany(),
    ]);

    const result = {
      tracks: await this.getTracks(tracks),
      albums: await this.getAlbums(albums),
      artists: await this.getArtists(artists),
    };

    return result;
  }

  private async getTracks(favorites: FavoriteTrack[]) {
    const trackIds = favorites.map((favorite) => favorite.trackId);
    return this.prisma.track.findMany({
      where: { id: { in: trackIds } },
    });
  }

  private async getAlbums(favorites: FavoriteAlbum[]) {
    const albumIds = favorites.map((favorite) => favorite.albumId);
    return this.prisma.album.findMany({
      where: { id: { in: albumIds } },
    });
  }

  private async getArtists(favorites: FavoriteArtist[]) {
    const artistIds = favorites.map((favorite) => favorite.artistId);
    return this.prisma.artist.findMany({
      where: { id: { in: artistIds } },
    });
  }

  async addFavorite(type: FavoriteType, id: string) {
    if (!(await this.validateEntityExists(type, id))) {
      throw new UnprocessableEntityException(
        `${type.slice(0, -1)} with ID ${id} not found`,
      );
    }

    const existingFavorite = await this.findFavorite(type, id);
    if (existingFavorite) {
      throw new BadRequestException(
        `${type.slice(0, -1)} with ID ${id} is already in favorites`,
      );
    }

    await this.addToFavoriteTable(type, id);

    return {
      message: `${type.slice(
        0,
        -1,
      )} with ID ${id} has been added to favorites.`,
    };
  }

  private async addToFavoriteTable(type: FavoriteType, id: string) {
    switch (type) {
      case 'tracks':
        await this.prisma.favoriteTrack.create({
          data: { trackId: id },
        });
        break;
      case 'albums':
        await this.prisma.favoriteAlbum.create({
          data: { albumId: id },
        });
        break;
      case 'artists':
        await this.prisma.favoriteArtist.create({
          data: { artistId: id },
        });
        break;
      default:
        throw new BadRequestException('Invalid favorite type');
    }
  }

  private async findFavorite(type: FavoriteType, id: string) {
    switch (type) {
      case 'tracks':
        return this.prisma.favoriteTrack.findUnique({
          where: { trackId: id },
        });
      case 'albums':
        return this.prisma.favoriteAlbum.findUnique({
          where: { albumId: id },
        });
      case 'artists':
        return this.prisma.favoriteArtist.findUnique({
          where: { artistId: id },
        });
      default:
        return null;
    }
  }

  async removeFavorite(type: FavoriteType, id: string) {
    const favorite = await this.findFavorite(type, id);
    if (!favorite) {
      throw new NotFoundException(
        `${type.slice(0, -1)} with ID ${id} is not in favorites`,
      );
    }

    await this.removeFromFavoriteTable(type, id);

    return {
      message: `${type.slice(
        0,
        -1,
      )} with ID ${id} has been removed from favorites.`,
    };
  }

  private async removeFromFavoriteTable(type: FavoriteType, id: string) {
    switch (type) {
      case 'tracks':
        await this.prisma.favoriteTrack.delete({
          where: { trackId: id },
        });
        break;
      case 'albums':
        await this.prisma.favoriteAlbum.delete({
          where: { albumId: id },
        });
        break;
      case 'artists':
        await this.prisma.favoriteArtist.delete({
          where: { artistId: id },
        });
        break;
      default:
        throw new BadRequestException('Invalid favorite type');
    }
  }

  private async validateEntityExists(
    type: FavoriteType,
    id: string,
  ): Promise<boolean> {
    switch (type) {
      case 'artists':
        return !!(await this.prisma.artist.findUnique({ where: { id } }));
      case 'albums':
        return !!(await this.prisma.album.findUnique({ where: { id } }));
      case 'tracks':
        return !!(await this.prisma.track.findUnique({ where: { id } }));
      default:
        return false;
    }
  }
}
