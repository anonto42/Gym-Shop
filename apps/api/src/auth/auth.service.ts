import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  createUser(email: string, password: string){
    const user = this.usersRepo.create({ email, password })
    
  }

  async login(user) {
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
    return { accessToken, refreshToken };
  }

  async getUserRoles(userId: string): Promise<string[]> {
    return [""]
  }
}
