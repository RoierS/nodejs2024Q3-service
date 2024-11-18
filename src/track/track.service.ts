import { Injectable, NotFoundException } from '@nestjs/common';

import { Track } from './entities/track.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTracks(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findTrackById(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async createTrack(trackData: Partial<Track>): Promise<Track> {
    const newTrack = await this.prisma.track.create({
      data: {
        name: trackData.name,
        artistId: trackData.artistId,
        albumId: trackData.albumId,
        duration: trackData.duration,
      },
    });

    return newTrack;
  }

  async updateTrack(id: string, updatedFields: Partial<Track>): Promise<Track> {
    const existingTrack = await this.prisma.track.findUnique({ where: { id } });

    if (!existingTrack) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: {
        ...updatedFields,
      },
    });

    return updatedTrack;
  }

  async deleteTrack(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    await this.prisma.track.delete({ where: { id } });
  }
}
