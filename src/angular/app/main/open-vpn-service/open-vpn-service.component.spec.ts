import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenVpnServiceComponent } from './open-vpn-service.component';

describe('OpenVpnServiceComponent', () => {
  let component: OpenVpnServiceComponent;
  let fixture: ComponentFixture<OpenVpnServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenVpnServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenVpnServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
