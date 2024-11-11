import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService, FavoriteType } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllFavorites() {
    return this.databaseService.getAllFavorites();
  }

  addFavorite(type: FavoriteType, id: string) {
    try {
      this.databaseService.addFavorite(type, id);

      return {
        message: `${type.slice(
          0,
          -1,
        )} with ID ${id} has been added to favorites.`,
      };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);

      if (error instanceof BadRequestException)
        throw new BadRequestException(error.message);

      throw error;
    }
  }

  removeFavorite(type: FavoriteType, id: string) {
    try {
      this.databaseService.removeFavorite(type, id);

      return {
        message: `${type.slice(
          0,
          -1,
        )} with ID ${id} has been removed from favorites.`,
      };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);

      if (error instanceof BadRequestException)
        throw new BadRequestException(error.message);

      throw error;
    }
  }
}
