import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvConfig } from './env-config.interface';

@Injectable()
export class EnvConfigService implements IEnvConfig {
  constructor(private readonly _configService: ConfigService) {}

  getNodeEnv(): string {
    return String(this._configService.get<string>('NODE_ENV'));
  }
  getAppPort(): number {
    return Number(this._configService.get<number>('PORT'));
  }

  getJWTSecret() {
    return String(this._configService.get<string>('JWT_SECRET'));
  }

  getJWTExpireIn() {
    return Number(this._configService.get<number>('JWT_EXPIRE_IN'));
  }

  getCorsOriginWhiteList() {
    return this._parseCSV(
      this._configService.get<string>('CORS_ORIGIN_WHITELIST'),
    );
  }

  private _parseCSV(csv: string): string[] {
    return `${csv}`.split(',').map((value) => value.trim());
  }
}
