import {Service} from "./service";
import {VirtualMachine} from "./virtual-machine";

export interface ServiceDragInfo {
  event: DragEvent;
  service: Service;
  virtualMachine: VirtualMachine;
}
