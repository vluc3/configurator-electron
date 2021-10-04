import {Network} from "./network";
import {VirtualMachine} from "./virtual-machine";

export interface Host {
  name: string;
  network: Network;
  password: string;
  datastore: string;
  ip: string;
  virtualMachines: VirtualMachine[]
}
