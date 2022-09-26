import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileIronServiceComponent } from './mobile-iron-service.component';

describe('MobileIronServiceComponent', () => {
  let component: MobileIronServiceComponent;
  let fixture: ComponentFixture<MobileIronServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileIronServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileIronServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
