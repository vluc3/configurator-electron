import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VirtualMachineComponent} from './virtual-machine.component';
import {stateService} from "../../../common/utils/utils.spec";
import {StateService} from "../../../common/service/state.service";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";
import {HostItemComponent} from "./host-item/host-item.component";
import {VirtualMachineItemComponent} from "./virtual-machine-item/virtual-machine-item.component";
import {VirtualMachineItemServiceComponent} from "./virtual-machine-item-service/virtual-machine-item-service.component";

describe('VirtualMachineComponent', () => {
  let component: VirtualMachineComponent;
  let fixture: ComponentFixture<VirtualMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        VirtualMachineComponent,
        HostItemComponent,
        VirtualMachineItemComponent,
        VirtualMachineItemServiceComponent
      ],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
