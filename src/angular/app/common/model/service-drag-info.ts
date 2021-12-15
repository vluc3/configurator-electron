import {VirtualMachine} from "./virtual-machine";

export interface ServiceDragInfo {
  event: DragEvent;
  serviceId: string;
  virtualMachine: VirtualMachine;
}
