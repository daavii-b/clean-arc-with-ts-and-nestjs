import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvConfig } from './env-config.inerface';

@Injectable()
export class EnvConfigService implements IEnvConfig {
  constructor(private readonly _configService: ConfigService) {}

  getNodeEnv(): string {
    return String(this._configService.get<string>('NODE_ENV'));
  }
  getAppPort(): number {
    return Number(this._configService.get<number>('PORT'));
  }
}
