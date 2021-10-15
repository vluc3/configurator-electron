import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HostItemComponent} from './host-item.component';
import {StateService} from "../../../../common/service/state.service";
import {stateService} from "../../../../common/utils/utils.spec";
import {AppTranslateModule} from "../../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";
import {Network} from "../../../../common/model/network";

describe('HostItemComponent', () => {
  let component: HostItemComponent;
  let fixture: ComponentFixture<HostItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostItemComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostItemComponent);
    component = fixture.componentInstance;
    component.host = {
      name: "",
      network: Network.EXPLOITATION,
      password: "",
      datastore: "",
      ip: "",
      virtualMachines: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
