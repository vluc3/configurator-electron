import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalComponent} from './modal.component';
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('ModalComponent', () => {
  let component: ModalComponent<any>;
  let fixture: ComponentFixture<ModalComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
