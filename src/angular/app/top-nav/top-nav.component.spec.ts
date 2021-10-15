import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopNavComponent} from './top-nav.component';
import {AppTranslateModule} from "../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopNavComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
