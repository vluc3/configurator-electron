import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHostComponent } from './new-host.component';

describe('HostComponent', () => {
  let component: NewHostComponent;
  let fixture: ComponentFixture<NewHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewHostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
