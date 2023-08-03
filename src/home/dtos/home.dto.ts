import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class HomeResponseDto {
  @IsString()
  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @IsNumber()
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms(): number {
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  @IsNumber()
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms(): number {
    return this.number_of_bathrooms;
  }

  @IsString()
  city: string;

  @Exclude()
  listed_date: Date;

  @Expose({ name: 'listedDate' })
  @IsString()
  listedDate(): Date {
    return this.listed_date;
  }

  @IsNumber()
  price: number;

  @Exclude()
  land_size: number;

  @Expose({ name: 'landSize' })
  @IsNumber()
  landSize(): number {
    return this.land_size;
  }

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;

  image: string;

  @Exclude()
  images;
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}
// create body in json so i can hit the create endpoint

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}

export class InquireDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
