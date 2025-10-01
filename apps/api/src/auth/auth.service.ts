import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from 'generated/prisma';
import { addDays } from 'date-fns';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    
    const user = await this.prisma.user.findUnique({ where: { email }});
    if (!user || !user.passwordHash) return null;

    const matches = await argon2.verify(user.passwordHash, pass);
    if (!matches) return null;
    
    return user;
  }

  async login(user: User) {
    const roles = await this.getUserRoles(user.id);
    const payload = { sub: user.id, roles };
  
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = randomBytes(64).toString('hex');
    const refreshHash = await argon2.hash(refreshToken, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64MB
      timeCost: 3,
      parallelism: 1,
      hashLength: 32
    });
    await this.prisma.refreshToken.create({
      data: { tokenHash: refreshHash, userId: user.id, expiresAt: '10d' }
    });
    return { accessToken, refreshToken };
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },  // 👈 load roles
    });
  
    if (!user) return [];
    return user.roles.map(r => r.name);
  }
}
