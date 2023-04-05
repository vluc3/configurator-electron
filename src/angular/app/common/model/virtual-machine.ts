import { OperatingSystemEnum } from "./operating-system.enum";

export interface VirtualMachine {
  name?: string;
  ip: string;
  mask: string;
  operatingSystem: OperatingSystemEnum;
  gateway?: string;
  services: string[];
}
