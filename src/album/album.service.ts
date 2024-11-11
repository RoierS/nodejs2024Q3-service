import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Album } from './entities/album.entity';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllAlbums(): Album[] {
    return this.databaseService.getAllAlbums();
  }

  getAlbumById(id: string): Album {
    return this.databaseService.findAlbumById(id);
  }

  createAlbum(createAlbumDto: CreateAlbumDto): Album {
    return this.databaseService.createAlbum(createAlbumDto);
  }

  updateAlbum(id: string, updatedFields: UpdateAlbumDto): Album {
    const existingAlbum = this.databaseService.findAlbumById(id);

    if (!existingAlbum) {
      throw new NotFoundException('Album not found');
    }

    return this.databaseService.updateAlbum(id, updatedFields);
  }

  deleteAlbum(id: string): void {
    const album = this.databaseService.findAlbumById(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    this.databaseService.deleteAlbum(id);
  }
}
