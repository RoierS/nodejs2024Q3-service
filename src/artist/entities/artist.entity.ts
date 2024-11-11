import { v4 as uuidv4 } from 'uuid';

export class Artist {
  id: string;
  name: string;
  grammy: boolean;

  constructor(partial: Partial<Artist>) {
    this.id = uuidv4();
    this.name = partial.name;
    this.grammy = partial.grammy;
  }
}
