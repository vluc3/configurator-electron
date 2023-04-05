import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JabberServiceComponent } from './jabber-service.component';

describe('JabberServiceComponent', () => {
  let component: JabberServiceComponent;
  let fixture: ComponentFixture<JabberServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JabberServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JabberServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
