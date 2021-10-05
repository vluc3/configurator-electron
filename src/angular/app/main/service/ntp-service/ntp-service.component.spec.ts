import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NtpServiceComponent } from './ntp-service.component';

describe('NtpServiceComponent', () => {
  let component: NtpServiceComponent;
  let fixture: ComponentFixture<NtpServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NtpServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NtpServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
