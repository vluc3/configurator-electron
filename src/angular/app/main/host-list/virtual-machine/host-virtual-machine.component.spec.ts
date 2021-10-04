import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HostVirtualMachineComponent} from './host-virtual-machine.component';

describe('VirtualMachineComponent', () => {
  let component: HostVirtualMachineComponent;
  let fixture: ComponentFixture<HostVirtualMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostVirtualMachineComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostVirtualMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
