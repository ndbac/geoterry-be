import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  TerryReportInputDto,
  TerryReportResDto,
} from '../dto/terry-report.dto';

export enum ETerryReportOperation {
  HUNTER_REPORT_TERRY = 'hunterReportTerry',
}

export const TERRY_REPORT_ENDPOINT_CONFIG: Record<
  ETerryReportOperation,
  IEndpointConfiguration
> = {
  [ETerryReportOperation.HUNTER_REPORT_TERRY]: {
    operationId: ETerryReportOperation.HUNTER_REPORT_TERRY,
    summary: 'Hunter report terry',
    body: {
      type: TerryReportInputDto,
    },
    responses: [
      {
        type: TerryReportResDto,
        status: HttpStatus.CREATED,
      },
    ],
  },
};
