import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VirtualMachineItemServiceComponent} from './virtual-machine-item-service.component';
import {AppTranslateModule} from "../../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('VirtualMachineItemServiceComponent', () => {
  let component: VirtualMachineItemServiceComponent;
  let fixture: ComponentFixture<VirtualMachineItemServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VirtualMachineItemServiceComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualMachineItemServiceComponent);
    component = fixture.componentInstance;
    component.service = {
      name: "",
      icon: ""
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
