import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailServiceComponent } from './mail-service.component';

describe('MailServiceComponent', () => {
  let component: MailServiceComponent;
  let fixture: ComponentFixture<MailServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
