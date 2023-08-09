import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
interface SignUpParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SignInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signUp(
    { email, password, name, phone }: SignUpParams,
    userType: UserType,
  ) {
    const userExists = await this.prismaService.user.findMany({
      where: {
        OR: [
          {
            phone,
          },
          {
            email,
          },
        ],
      },
    });

    if (userExists.length > 0) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        user_type: userType,
        phone,
      },
    });
    return this.generateJWT(user.name, user.id);
  }

  async signIn({ email, password }: SignInParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ConflictException('User does not exists');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.generateJWT(user.name, user.id);
  }

  private generateJWT(name: string, id: number): string {
    return jwt.sign({ name, id }, process.env.JSON_TOKEN_KEY, {
      expiresIn: '1d',
    });
  }

  generateProductKey(email: string, userType: UserType): string {
    const key = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hashSync(key, 10);
  }
}
