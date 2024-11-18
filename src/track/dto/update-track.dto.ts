import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  artistId: string | null;

  @IsString()
  @IsOptional()
  albumId: string | null;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
