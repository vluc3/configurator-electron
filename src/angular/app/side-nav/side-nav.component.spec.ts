import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SideNavComponent} from './side-nav.component';
import {RouterTestingModule} from "@angular/router/testing";
import {stateService} from "../common/utils/utils.spec";
import {StateService} from "../common/service/state.service";
import {AppTranslateModule} from "../app-translate.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideNavComponent],
      imports: [RouterTestingModule, AppTranslateModule, HttpClientTestingModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
