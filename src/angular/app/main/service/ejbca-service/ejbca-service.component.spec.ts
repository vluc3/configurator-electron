import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjbcaServiceComponent } from './ejbca-service.component';

describe('EjbcaServiceComponent', () => {
  let component: EjbcaServiceComponent;
  let fixture: ComponentFixture<EjbcaServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjbcaServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjbcaServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
