import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllArtists(): Artist[] {
    return this.databaseService.getAllArtists();
  }

  getArtistById(id: string): Artist {
    const artist = this.databaseService.findArtistById(id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  createArtist(createArtistDto: CreateArtistDto): Artist {
    return this.databaseService.createArtist(new Artist(createArtistDto));
  }

  updateArtist(id: string, updateArtistDto: UpdateArtistDto): Artist {
    return this.databaseService.updateArtist(id, updateArtistDto);
  }

  deleteArtist(id: string): void {
    this.databaseService.deleteArtist(id);
  }
}
