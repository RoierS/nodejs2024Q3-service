import { Injectable, NotFoundException } from '@nestjs/common';

import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllArtists(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async getArtistById(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    return await this.prisma.artist.create({ data: { ...createArtistDto } });
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) throw new NotFoundException(`Artist with ID ${id} not found`);

    return await this.prisma.artist.update({
      where: { id },
      data: { ...artist, ...updateArtistDto },
    });
  }

  async deleteArtist(id: string): Promise<void> {
    const artistToDelete = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artistToDelete) throw new NotFoundException('Artist not found');

    await this.prisma.artist.delete({ where: { id } });
  }
}
