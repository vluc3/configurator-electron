import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixServiceComponent } from './matrix-service.component';

describe('MatrixServiceComponent', () => {
  let component: MatrixServiceComponent;
  let fixture: ComponentFixture<MatrixServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrixServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
