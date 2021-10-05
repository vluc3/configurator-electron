import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpSecServiceComponent } from './ip-sec-service.component';

describe('IpSecServiceComponent', () => {
  let component: IpSecServiceComponent;
  let fixture: ComponentFixture<IpSecServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpSecServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IpSecServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
