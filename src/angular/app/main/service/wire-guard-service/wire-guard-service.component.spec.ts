import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WireGuardServiceComponent } from './wire-guard-service.component';

describe('WireGuardServiceComponent', () => {
  let component: WireGuardServiceComponent;
  let fixture: ComponentFixture<WireGuardServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WireGuardServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WireGuardServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
