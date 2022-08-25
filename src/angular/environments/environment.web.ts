import { AppConfig } from './environment.model';

export const appConfig: AppConfig = {
  production: false,
  environment: 'WEB',
  version: require('../../../package.json').version,
};
