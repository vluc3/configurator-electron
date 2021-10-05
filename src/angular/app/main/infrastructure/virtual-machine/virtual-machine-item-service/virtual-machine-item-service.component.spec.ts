import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualMachineItemServiceComponent } from './virtual-machine-item-service.component';

describe('ServiceComponent', () => {
  let component: VirtualMachineItemServiceComponent;
  let fixture: ComponentFixture<VirtualMachineItemServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualMachineItemServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualMachineItemServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
