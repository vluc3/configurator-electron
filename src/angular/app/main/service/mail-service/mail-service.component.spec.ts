import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MailServiceComponent} from './mail-service.component';
import {StateService} from "../../../common/service/state.service";
import {stateService} from "../../../common/utils/utils.spec";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('MailServiceComponent', () => {
  let component: MailServiceComponent;
  let fixture: ComponentFixture<MailServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailServiceComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
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
