import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMachineComponent } from './admin-machine.component';

describe('AdminMachineServiceComponent', () => {
  let component: AdminMachineComponent;
  let fixture: ComponentFixture<AdminMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
