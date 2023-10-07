import { Injectable } from '@nestjs/common';
import { buildRegexSearchOptions } from 'src/shared/search.helpers';
import _ from 'lodash';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';
import {
  TERRY_FILTER_MAX_DISTANCE_IN_METER_DEFAULT,
  TERRY_FILTER_MIN_DISTANCE_IN_METER_DEFAULT,
} from '../constants';
import { IPagination } from 'src/shared/types';

@Injectable()
export class TerrySearchHelper {
  convertTerryFilterDtoToMongoAggregation(
    {
      profileId,
      textSearch,
      location,
      distance,
      categoryIds,
      size,
      difficulty,
      terrain,
    }: TerryFilterInputDto & { profileId?: string },
    pagination: IPagination,
  ) {
    const commonFilter = profileId ? { profileId } : {};
    const textSearchOption = buildRegexSearchOptions(textSearch, ['name']);
    let baseQuery = [] as any;
    if (_.isNil(location)) {
      baseQuery = [
        {
          $match: {
            $and: [
              commonFilter,
              ...(_.isEmpty(textSearchOption.$or) ? [] : [textSearchOption]),
              ...(!_.isEmpty(categoryIds)
                ? [{ categoryIds: { $in: categoryIds } }]
                : []),
              ...(!_.isEmpty(size)
                ? [
                    {
                      $and: [
                        { 'metadata.size': { $gte: size.min } },
                        { 'metadata.size': { $lte: size.max } },
                      ],
                    },
                  ]
                : []),
              ...(!_.isEmpty(difficulty)
                ? [
                    {
                      $and: [
                        { 'metadata.difficulty': { $gte: difficulty.min } },
                        { 'metadata.difficulty': { $lte: difficulty.max } },
                      ],
                    },
                  ]
                : []),
              ...(!_.isEmpty(terrain)
                ? [
                    {
                      $and: [
                        { 'metadata.terrain': { $gte: terrain.min } },
                        { 'metadata.terrain': { $lte: terrain.max } },
                      ],
                    },
                  ]
                : []),
            ],
          },
        },
      ];
    } else {
      baseQuery = [
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [location.longitude, location.latitude],
            },
            minDistance:
              distance?.min || TERRY_FILTER_MIN_DISTANCE_IN_METER_DEFAULT,
            maxDistance:
              distance?.max || TERRY_FILTER_MAX_DISTANCE_IN_METER_DEFAULT,
            spherical: true,
            query: {
              ...commonFilter,
              ...textSearchOption,
              ...(categoryIds ? { categoryIds: { $in: categoryIds } } : []),
              ...(!_.isEmpty(size)
                ? {
                    $and: [
                      { 'metadata.size': { $gte: size.min } },
                      { 'metadata.size': { $lte: size.max } },
                    ],
                  }
                : []),
              ...(!_.isEmpty(difficulty)
                ? {
                    $and: [
                      { 'metadata.difficulty': { $gte: difficulty.min } },
                      { 'metadata.difficulty': { $lte: difficulty.max } },
                    ],
                  }
                : []),
              ...(!_.isEmpty(terrain)
                ? {
                    $and: [
                      { 'metadata.terrain': { $gte: terrain.min } },
                      { 'metadata.terrain': { $lte: terrain.max } },
                    ],
                  }
                : []),
            },
            distanceField: 'distance',
          },
        },
      ];
    }
    return {
      queryWithoutPagination: baseQuery,
      queryWithPagination: [
        ...baseQuery,
        { $limit: pagination.pageSize + pagination.offset },
        { $skip: pagination.offset },
      ],
    };
  }

  normalizedMongoDbRecords() {
    return [
      {
        $addFields: {
          id: '$_id',
        },
      },
      {
        $unset: ['_id', '__v'],
      },
    ];
  }
}
