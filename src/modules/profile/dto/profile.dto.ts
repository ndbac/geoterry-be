import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ECommonFindAspects } from 'src/shared/types';

export class PublicReadProfileQueryDto {
  @ApiPropertyOptional({ enum: ECommonFindAspects })
  @IsOptional()
  @IsEnum(ECommonFindAspects)
  findBy?: ECommonFindAspects;
}

export class UserGetProfileNearbyReqDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
