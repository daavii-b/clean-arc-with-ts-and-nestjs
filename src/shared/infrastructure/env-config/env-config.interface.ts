export interface IEnvConfig {
  getAppPort: () => number;
  getNodeEnv: () => string;
  getJWTSecret: () => string;
  getJWTExpireIn: () => number;
  getCorsOriginWhiteList: () => string[];
}
