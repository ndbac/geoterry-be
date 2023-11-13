import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ETerryCheckedInFindAspects } from '../types';

export class FilterTerryCheckinDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  terryIds?: string;
}

export class ReadTerryCheckinQueryDto {
  @ApiPropertyOptional({ enum: ETerryCheckedInFindAspects })
  @IsOptional()
  @IsEnum(ETerryCheckedInFindAspects)
  findBy?: ETerryCheckedInFindAspects;
}
