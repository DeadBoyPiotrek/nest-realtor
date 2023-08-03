import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';

export interface HomeFilters {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  propertyType?: PropertyType;
}

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const filters: HomeFilters = {
      ...(city && { city }),
      ...(minPrice && { price: { gte: +minPrice } }),
      ...(maxPrice && { price: { lte: +maxPrice } }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHome(@Param('id') id: string) {
    return this.homeService.getHomeById(id);
  }

  @Post()
  createHome(@Body() body: CreateHomeDto) {
    return this.homeService.createHome(body);
  }

  @Put(':id')
  updateHome(@Param('id') id: string) {
    return {};
  }

  @Delete(':id')
  deleteHome(@Param('id') id: string) {
    return {};
  }
}
