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
// {
//   "address": "1234 Main St",
//   "numberOfBedrooms": 3,
//   "numberOfBathrooms": 2,
//   "city": "San Diego",
//   "price": 500000,
//   "landSize": 2000,
//   "propertyType": "HOUSE",
//   "images": [
//     {
//       "url": "https://images.unsplash.com/photo-1611095789922-4b7b7b0b2b0f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZXN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
//     },
//     {

//       "url": "https://images.unsplash.com/photo-1611095789922-4b7b7b0b2b0f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZXN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
//     }
//   ]
// }

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
