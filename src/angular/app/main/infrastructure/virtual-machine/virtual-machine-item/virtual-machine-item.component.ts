import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {VirtualMachine} from "../../../../common/model/virtual-machine";
import {Service} from "../../../../common/model/service";
import {ModalService} from "../../../../common/component/modal/modal.service";
import {StateService} from "../../../../common/service/state.service";
import {NewVirtualMachineComponent} from "../new-virtual-machine/new-virtual-machine.component";
import {clone} from "../../../../common/utils/utils";

@Component({
  selector: 'div[virtualMachineItem]',
  templateUrl: './virtual-machine-item.component.html',
  styleUrls: ['./virtual-machine-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualMachineItemComponent implements OnInit {

  @HostBinding('class') clazz = 'virtual-machine-item';

  @Input() virtualMachine: VirtualMachine;
  @Input() deletable = true;
  @Output() serviceDragStart = new EventEmitter<{ service: Service, event: DragEvent }>();
  @Output() onDelete = new EventEmitter<VirtualMachine>();

  constructor(
    private modalService: ModalService,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
  }

  edit() {
    this.modalService.open<VirtualMachine>({
      title: "Vms & Services",
      component: NewVirtualMachineComponent,
      data: clone(this.virtualMachine),
      width: 800
    }).subscribe(close => {
      if (!close.cancel && close.data) {
        this.virtualMachine = close.data;
        this.stateService.save();
      }
    });
  }

  delete() {
    this.modalService.open({
      title: 'Suppression d\'hôte',
      html: `<p class="text-danger">Êtes vous sur de vouloir supprimer cet VM</p>`,
    }).subscribe(close => {
      if (!close.cancel) {
        this.onDelete.emit(this.virtualMachine);
      }
    });
  }

  onServiceDelete(service: Service) {
    const index = this.virtualMachine.services.indexOf(service);
    if (index !== -1) {
      this.virtualMachine.services.splice(index, 1);
      this.stateService.getStore().serviceKeys.push(service);
      this.stateService.save();
    }
  }
}