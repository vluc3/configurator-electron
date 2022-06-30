import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirewallsComponent } from './firewalls.component';
import {AppTranslateModule} from "../../../app-translate.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {StateService} from "../../../common/service/state.service";
import {stateService} from "../../../common/utils/utils.spec";

describe('FirewallComponent', () => {
  let component: FirewallsComponent;
  let fixture: ComponentFixture<FirewallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirewallsComponent ],
      imports: [AppTranslateModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirewallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
