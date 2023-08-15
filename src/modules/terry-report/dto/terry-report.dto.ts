import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDbResponseDto } from 'src/shared/common-DTOs';

export class TerryReportInputDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  terryId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class TerryReportResDto extends BaseDbResponseDto {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  terryId: string;

  @ApiProperty({ type: String })
  profileId: string;

  @ApiProperty({ type: String })
  description: string;
}
