import { OperatingSystemEnum } from "./operating-system.enum";

export interface ServiceOrder {
  name: string;
  order?: number;
}

export interface Service {
  id: string;
  name: string;
  icon?: string;
  operatingSystem: OperatingSystemEnum;
  services: string[];
  replicable?: boolean;
  hidden?: boolean;
  /**
   * TODO TEMP to be removed in next version
   */
  notDeployable?: boolean;
}
