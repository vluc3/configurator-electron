import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OpenVpnServiceComponent} from './open-vpn-service.component';
import {stateService} from "../../../common/utils/utils.spec";
import {StateService} from "../../../common/service/state.service";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('OpenVpnServiceComponent', () => {
  let component: OpenVpnServiceComponent;
  let fixture: ComponentFixture<OpenVpnServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenVpnServiceComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenVpnServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
