import { Injectable } from '@nestjs/common';
import { TerryReportRepository } from '../terry-report.repository';
import { TerryReportInputDto } from '../dto/terry-report.dto';

@Injectable()
export class TerryReportService {
  constructor(private readonly terryReportRepo: TerryReportRepository) {}

  async report(data: TerryReportInputDto, profileId: string) {
    return this.terryReportRepo.create({ ...data, profileId });
  }
}
