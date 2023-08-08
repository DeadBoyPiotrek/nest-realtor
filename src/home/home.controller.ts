import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, InquireDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/role.decorator';

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
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }

  @Roles('REALTOR', 'ADMIN')
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
  }

  @Roles('REALTOR', 'ADMIN')
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<CreateHomeDto>,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getHomeByRealtorId(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.updateHome(id, body);
  }

  @Roles('REALTOR', 'ADMIN')
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getHomeByRealtorId(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.deleteHome(id);
  }
  @Roles('BUYER')
  @Post('inquire/:id')
  Inquire(
    @User() user: UserInfo,
    @Param('id', ParseIntPipe) homeId: number,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }
  @Get(':id/messages')
  async getMessages(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getHomeByRealtorId(homeId);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.getMessages(homeId);
  }
}
