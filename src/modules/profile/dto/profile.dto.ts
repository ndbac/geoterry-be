import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ECommonFindAspects } from 'src/shared/types';

export class PublicReadProfileQueryDto {
  @ApiPropertyOptional({ enum: ECommonFindAspects })
  @IsOptional()
  @IsEnum(ECommonFindAspects)
  findBy?: ECommonFindAspects;
}
