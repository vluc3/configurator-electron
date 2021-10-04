import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToipWebUiServiceComponent } from './toip-web-ui-service.component';

describe('ToipWebUiServiceComponent', () => {
  let component: ToipWebUiServiceComponent;
  let fixture: ComponentFixture<ToipWebUiServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToipWebUiServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToipWebUiServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
