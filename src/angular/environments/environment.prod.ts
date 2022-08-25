import { AppConfig } from './environment.model';

export const appConfig: AppConfig = {
  production: true,
  environment: 'PROD',
  version: require('../../../package.json').version,
};
