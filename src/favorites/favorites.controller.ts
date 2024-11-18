import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllFavorites() {
    return this.favoritesService.getAllFavorites();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addFavorite('tracks', id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeFavorite('tracks', id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addFavorite('albums', id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeFavorite('albums', id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addFavorite('artists', id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeFavorite('artists', id);
  }
}
