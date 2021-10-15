import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VirtualMachineComponent} from './virtual-machine.component';
import {stateService} from "../../../common/utils/utils.spec";
import {StateService} from "../../../common/service/state.service";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('VirtualMachineComponent', () => {
  let component: VirtualMachineComponent;
  let fixture: ComponentFixture<VirtualMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VirtualMachineComponent],
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
