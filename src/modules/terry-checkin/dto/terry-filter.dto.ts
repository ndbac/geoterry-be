import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ETerryCheckedInFindAspects } from '../types';
import { Transform } from 'class-transformer';
import _ from 'lodash';

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

  @ApiPropertyOptional({ type: Boolean })
  @Transform(({ value }) => {
    if (_.isNil(value)) return undefined;
    return value === 'true';
  })
  @IsBoolean()
  @IsOptional()
  includeUserPath?: boolean;
}
