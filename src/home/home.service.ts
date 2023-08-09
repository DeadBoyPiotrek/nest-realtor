import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateHomeDto, HomeResponseDto } from './dtos/home.dto';
import { HomeFilters } from './home.controller';
import { UserInfo } from 'src/user/decorators/user.decorator';

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
  async getHomeById(id: number) {
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

  async createHome(body: CreateHomeDto, userId: number) {
    const home = await this.prismaService.home.create({
      data: {
        address: body.address,
        city: body.city,
        price: body.price,
        number_of_bathrooms: body.numberOfBathrooms,
        number_of_bedrooms: body.numberOfBedrooms,
        land_size: body.landSize,
        realtor_id: userId,
        propertyType: body.propertyType,
        images: {
          create: body.images,
        },
      },
    });

    return new HomeResponseDto(home);
  }

  async updateHome(id: number, body: Partial<CreateHomeDto>) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: +id,
      },
    });

    if (!home) {
      throw new NotFoundException('Home not found');
    }
    const updatedHome = await this.prismaService.home.update({
      where: {
        id: +id,
      },
      data: {
        address: body.address,
        city: body.city,
        price: body.price,
        number_of_bathrooms: body.numberOfBathrooms,
        number_of_bedrooms: body.numberOfBedrooms,
        land_size: body.landSize,
        propertyType: body.propertyType,
        images: {
          create: body.images,
        },
      },
    });

    return new HomeResponseDto(updatedHome);
  }

  async deleteHome(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: +id,
      },
    });

    if (!home) {
      throw new NotFoundException('Home not found');
    }

    await this.prismaService.home.delete({
      where: {
        id: +id,
      },
    });

    return new HomeResponseDto(home);
  }

  async getHomeByRealtorId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException('Home not found');
    }

    return home.realtor;
  }
  async inquire(user: UserInfo, homeId: number, message: string) {
    const realtor = await this.getHomeByRealtorId(homeId);
    return await this.prismaService.message.create({
      data: {
        realtor_id: realtor.id,
        buyer_id: user.id,
        home_id: homeId,
        message,
      },
    });
  }

  async getMessages(homeId: number) {
    const messages = await this.prismaService.message.findMany({
      where: {
        home_id: homeId,
      },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    return messages;
  }
}
