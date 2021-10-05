import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhcpDnsServiceComponent } from './dhcp-dns-service.component';

describe('DhcpDnsServiceComponent', () => {
  let component: DhcpDnsServiceComponent;
  let fixture: ComponentFixture<DhcpDnsServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhcpDnsServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhcpDnsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
