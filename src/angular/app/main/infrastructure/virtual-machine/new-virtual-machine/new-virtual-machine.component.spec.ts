import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVirtualMachineComponent } from './new-virtual-machine.component';

describe('NewVirtualMachineComponent', () => {
  let component: NewVirtualMachineComponent;
  let fixture: ComponentFixture<NewVirtualMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewVirtualMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVirtualMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
