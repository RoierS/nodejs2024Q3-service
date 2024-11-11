import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

import { v4 as uuidv4 } from 'uuid';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllTracks(): Track[] {
    return this.databaseService.getAllTracks();
  }

  findTrackById(id: string): Track {
    return this.databaseService.findTrackById(id);
  }

  createTrack(trackData: Partial<Track>): Track {
    const newTrack = new Track({
      id: uuidv4(),
      ...trackData,
    });

    return this.databaseService.createTrack(newTrack);
  }

  updateTrack(id: string, updatedFields: Partial<Track>): Track {
    const existingTrack = this.databaseService.findTrackById(id);

    if (!existingTrack) {
      throw new NotFoundException('Track not found');
    }

    return this.databaseService.updateTrack(id, updatedFields);
  }

  deleteTrack(id: string): void {
    const track = this.databaseService.findTrackById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    this.databaseService.deleteTrack(id);
  }
}
