import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VirtualMachineItemComponent} from './virtual-machine-item.component';
import {stateService} from "../../../../common/utils/utils.spec";
import {StateService} from "../../../../common/service/state.service";
import {AppTranslateModule} from "../../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('VirtualMachineItemComponent', () => {
  let component: VirtualMachineItemComponent;
  let fixture: ComponentFixture<VirtualMachineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VirtualMachineItemComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualMachineItemComponent);
    component = fixture.componentInstance;
    component.virtualMachine = {
      name: "",
      ip: "",
      mask: "",
      gateway: "",
      services: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
