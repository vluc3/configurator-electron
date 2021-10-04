import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualMachineItemComponent } from './virtual-machine-item.component';

describe('VirtualMachineItemComponent', () => {
  let component: VirtualMachineItemComponent;
  let fixture: ComponentFixture<VirtualMachineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualMachineItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualMachineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
