import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './entities/album.entity';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAlbums(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async getAlbumById(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = await this.prisma.album.create({
      data: {
        ...createAlbumDto,
      },
    });

    return newAlbum;
  }

  async updateAlbum(id: string, updatedFields: UpdateAlbumDto): Promise<Album> {
    const existingAlbum = await this.prisma.album.findUnique({ where: { id } });

    if (!existingAlbum) {
      throw new NotFoundException('Album not found');
    }

    return await this.prisma.album.update({
      where: { id },
      data: { ...existingAlbum, ...updatedFields },
    });
  }

  async deleteAlbum(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.prisma.album.delete({ where: { id } });
  }
}
