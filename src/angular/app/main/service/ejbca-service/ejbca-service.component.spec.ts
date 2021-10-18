import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EjbcaServiceComponent} from './ejbca-service.component';
import {stateService} from "../../../common/utils/utils.spec";
import {StateService} from "../../../common/service/state.service";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('EjbcaServiceComponent', () => {
  let component: EjbcaServiceComponent;
  let fixture: ComponentFixture<EjbcaServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EjbcaServiceComponent],
      imports: [AppTranslateModule, HttpClientModule, FormsModule, ReactiveFormsModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
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
