import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, HomeResponseDto } from './dtos/home.dto';
import { HomeFilters } from './home.controller';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: HomeFilters): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      include: {
        images: {
          select: {
            url: true,
          },
        },
      },
      where: {
        ...filters,
      },
    });

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map(
      (home) => new HomeResponseDto({ ...home, image: home.images[0].url }),
    );
  }
  async getHomeById(id: string) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: +id,
      },
    });

    if (!home) {
      throw new NotFoundException('Home not found');
    }

    return new HomeResponseDto(home);
  }

  async createHome(body: CreateHomeDto) {
    const home = await this.prismaService.home.create({
      data: {
        address: body.address,
        city: body.city,
        price: body.price,
        number_of_bathrooms: body.numberOfBathrooms,
        number_of_bedrooms: body.numberOfBedrooms,
        land_size: body.landSize,
        realtor_id: 1,
        propertyType: body.propertyType,
        images: {
          create: body.images,
        },
      },
    });

    return new HomeResponseDto(home);
  }
}
