import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirewallComponent } from './firewall.component';
import {AppTranslateModule} from "../../../app-translate.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {StateService} from "../../../common/service/state.service";
import {stateService} from "../../../common/utils/utils.spec";

describe('FirewallComponent', () => {
  let component: FirewallComponent;
  let fixture: ComponentFixture<FirewallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirewallComponent ],
      imports: [AppTranslateModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirewallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
