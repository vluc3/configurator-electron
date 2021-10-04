import {Service} from "./service";

export interface VirtualMachine {
  name?: string;
  ip: string;
  mask: string;
  gateway?: string;
  services: Service[];
}
