import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostItemComponent } from './host-item.component';

describe('HostItemComponent', () => {
  let component: HostItemComponent;
  let fixture: ComponentFixture<HostItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
