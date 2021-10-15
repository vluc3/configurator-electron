import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IpSecServiceComponent} from './ip-sec-service.component';
import {stateService} from "../../../common/utils/utils.spec";
import {StateService} from "../../../common/service/state.service";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('IpSecServiceComponent', () => {
  let component: IpSecServiceComponent;
  let fixture: ComponentFixture<IpSecServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IpSecServiceComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IpSecServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
