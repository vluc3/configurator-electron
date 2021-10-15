import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HostListItemComponent} from './host-list-item.component';
import {StateService} from "../../../../common/service/state.service";
import {stateService} from "../../../../common/utils/utils.spec";
import {AppTranslateModule} from "../../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";
import {Network} from "../../../../common/model/network";

describe('HostListItemComponent', () => {
  let component: HostListItemComponent;
  let fixture: ComponentFixture<HostListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostListItemComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostListItemComponent);
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
