import { v4 as uuidv4 } from 'uuid';

export class Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(partial: Partial<Album>) {
    this.id = uuidv4();
    this.name = partial.name;
    this.year = partial.year;
    this.artistId = partial.artistId;
  }
}
