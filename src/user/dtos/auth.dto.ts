import { UserType } from '@prisma/client';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^\+?[1-9][0-9]{7,14}$/, {
    message: 'Phone number must be right format',
  })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  productKey?: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
