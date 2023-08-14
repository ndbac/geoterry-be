import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { IamNamespace } from 'src/shared/types';
import { TerryCategroyService } from '../providers/terry-category.service';
import {
  TERRY_CATEGORY_ENDPOINT_CONFIG,
  ETerryCategoryOperation,
} from './endpoint-config';
import {
  FilterTerryCategoryInputDto,
  TerryCategoryInputDto,
  UpdateTerryCategoryInputDto,
} from '../dto/terry-category.dto';

@Controller('admin/terry-category')
@ApiTags('admin.terryCategory')
@UseFilters(I18nExceptionFilter)
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TerryCategoryController {
  constructor(private readonly terryCategorySvc: TerryCategroyService) {}

  @EndpointConfig(
    TERRY_CATEGORY_ENDPOINT_CONFIG[
      ETerryCategoryOperation.ADMIN_CREATE_TERRY_CATEGORY
    ],
  )
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS],
  })
  @Post()
  async create(@Body() data: TerryCategoryInputDto) {
    return this.terryCategorySvc.createCategory(data);
  }

  @EndpointConfig(
    TERRY_CATEGORY_ENDPOINT_CONFIG[
      ETerryCategoryOperation.ADMIN_UPDATE_TERRY_CATEGORY
    ],
  )
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS],
  })
  @Put(':id')
  async update(
    @Body() data: UpdateTerryCategoryInputDto,
    @Param('id') id: string,
  ) {
    return this.terryCategorySvc.updateCategory(id, data);
  }

  @EndpointConfig(
    TERRY_CATEGORY_ENDPOINT_CONFIG[
      ETerryCategoryOperation.ADMIN_READ_TERRY_CATEGORY
    ],
  )
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS],
  })
  @Get(':id')
  async read(@Param('id') id: string) {
    return this.terryCategorySvc.readCategoryById(id);
  }

  @EndpointConfig(
    TERRY_CATEGORY_ENDPOINT_CONFIG[
      ETerryCategoryOperation.ADMIN_DELETE_TERRY_CATEGORY
    ],
  )
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS],
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.terryCategorySvc.deleteCategoryById(id);
  }

  @EndpointConfig(
    TERRY_CATEGORY_ENDPOINT_CONFIG[
      ETerryCategoryOperation.ADMIN_FILTER_TERRY_CATEGORY
    ],
  )
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS],
  })
  @Post('filter')
  async filter(@Body() data: FilterTerryCategoryInputDto) {
    return this.terryCategorySvc.readCategories(data);
  }
}
