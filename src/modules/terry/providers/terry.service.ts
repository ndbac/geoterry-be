import { Injectable } from '@nestjs/common';
import { TerryRepository } from '../terry.repository';
import { TerryInputDto } from '../dto/terry.dto';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';
import { MongoLocationType } from 'src/shared/mongoose/types';
import {
  TERRY_FILTER_MAX_DISTANCE_IN_METER_DEFAULT,
  TERRY_FILTER_MIN_DISTANCE_IN_METER_DEFAULT,
} from '../constants';

@Injectable()
export class TerryService {
  constructor(private readonly terryRepo: TerryRepository) {}

  async createTerry(data: TerryInputDto, profileId: string) {
    const terry = await this.terryRepo.create({
      profileId,
      ...data,
      location: {
        type: MongoLocationType.POINT,
        coordinates: [data.location.longitude, data.location.latitude],
      },
    });
    return terry;
  }

  async filterTerries(data: TerryFilterInputDto, profileId: string) {
    const terry = await this.terryRepo.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [data.location.longitude, data.location.latitude],
          },
          minDistance:
            data.distance?.min || TERRY_FILTER_MIN_DISTANCE_IN_METER_DEFAULT,
          maxDistance:
            data.distance?.max || TERRY_FILTER_MAX_DISTANCE_IN_METER_DEFAULT,
          spherical: true,
          query: { profileId },
          distanceField: 'distance',
        },
      },
      {
        $addFields: {
          id: '$_id',
        },
      },
      {
        $unset: ['_id', '__v'],
      },
    ]);
    return terry;
  }
}
