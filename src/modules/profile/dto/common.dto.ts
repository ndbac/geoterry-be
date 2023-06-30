import { ApiProperty } from '@nestjs/swagger';
import { GeneralActionStatus } from 'src/shared/types';

export class UploadPhotoResponseDto {
  @ApiProperty({
    description: 'Status always indicates SUCCEEDED',
    enum: [GeneralActionStatus.SUCCEEDED],
  })
  status: GeneralActionStatus.SUCCEEDED;

  @ApiProperty({
    description: 'Product photo public url',
  })
  photoUrl: string;
}

export class UploadPhotoDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}
