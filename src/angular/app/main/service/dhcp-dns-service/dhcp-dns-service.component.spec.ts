import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DhcpDnsServiceComponent} from './dhcp-dns-service.component';
import {StateService} from "../../../common/service/state.service";
import {stateService} from "../../../common/utils/utils.spec";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('DhcpDnsServiceComponent', () => {
  let component: DhcpDnsServiceComponent;
  let fixture: ComponentFixture<DhcpDnsServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DhcpDnsServiceComponent],
      imports: [AppTranslateModule, HttpClientModule, FormsModule, ReactiveFormsModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhcpDnsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
