import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IAccountRole } from 'src/shared/types';
import { ERoleRequestStatus } from '../types';

export class SwitchRoleInputDto {
  @ApiProperty({ enum: IAccountRole })
  @IsEnum(IAccountRole)
  @IsNotEmpty()
  role: IAccountRole;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class SwitchRoleResDto {
  @ApiProperty({ enum: ERoleRequestStatus })
  @IsNotEmpty()
  status: ERoleRequestStatus;
}
