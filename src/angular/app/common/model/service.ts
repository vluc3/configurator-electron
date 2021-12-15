export interface Service {
  id: string;
  name: string;
  icon?: string;
  services: string[];
  replicable?: boolean;
  /**
   * TODO TEMP to be removed in next version
   */
  notDeployable?: boolean;
}
