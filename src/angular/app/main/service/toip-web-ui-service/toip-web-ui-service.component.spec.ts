import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ToipWebUiServiceComponent} from './toip-web-ui-service.component';
import {stateService} from "../../../common/utils/utils.spec";
import {StateService} from "../../../common/service/state.service";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('ToipWebUiServiceComponent', () => {
  let component: ToipWebUiServiceComponent;
  let fixture: ComponentFixture<ToipWebUiServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToipWebUiServiceComponent],
      imports: [AppTranslateModule, HttpClientModule, FormsModule, ReactiveFormsModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
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
