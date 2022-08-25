import { AppConfig } from './environment.model';

export const appConfig: AppConfig = {
  production: false,
  environment: 'DEV',
  version: require('../../../package.json').version,
};
