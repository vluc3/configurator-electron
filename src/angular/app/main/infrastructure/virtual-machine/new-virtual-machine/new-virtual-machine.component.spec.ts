import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NewVirtualMachineComponent} from './new-virtual-machine.component';
import {stateService} from "../../../../common/utils/utils.spec";
import {StateService} from "../../../../common/service/state.service";
import {AppTranslateModule} from "../../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('NewVirtualMachineComponent', () => {
  let component: NewVirtualMachineComponent;
  let fixture: ComponentFixture<NewVirtualMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewVirtualMachineComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVirtualMachineComponent);
    component = fixture.componentInstance;
    component.data = {
      name: "",
      ip: "",
      mask: "",
      services: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
