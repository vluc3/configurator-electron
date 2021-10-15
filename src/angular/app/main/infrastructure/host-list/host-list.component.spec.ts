import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HostListComponent} from './host-list.component';
import {stateService} from "../../../common/utils/utils.spec";
import {StateService} from "../../../common/service/state.service";
import {AppTranslateModule} from "../../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('HostListComponent', () => {
  let component: HostListComponent;
  let fixture: ComponentFixture<HostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostListComponent],
      imports: [AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
