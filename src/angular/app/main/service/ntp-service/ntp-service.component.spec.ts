import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NtpServiceComponent} from './ntp-service.component';
import {stateService} from "../../../common/utils/utils.spec";
import {StateService} from "../../../common/service/state.service";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('NtpServiceComponent', () => {
  let component: NtpServiceComponent;
  let fixture: ComponentFixture<NtpServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NtpServiceComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NtpServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
