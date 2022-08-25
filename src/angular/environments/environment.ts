import { AppConfig } from './environment.model';

export const appConfig: AppConfig = {
  production: false,
  environment: 'LOCAL',
  version: require('../../../package.json').version,
};
