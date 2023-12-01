import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvConfigService } from '@shared/infrastructure/env-config/env-config.service';

export type JwtProps = {
  accessToken: string;
  userId: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async generateJwt(userId: string): Promise<JwtProps> {
    const accessToken = await this.jwtService.signAsync({
      userId: userId,
    });

    return {
      accessToken,
      userId,
    };
  }

  async verifyJwt(token) {
    return this.jwtService.verifyAsync(token, {
      secret: this.envConfigService.getJWTSecret(),
    });
  }
}
