import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeModalComponent} from './home-modal.component';
import {RouterTestingModule} from "@angular/router/testing";
import {stateService} from "../../common/utils/utils.spec";
import {StateService} from "../../common/service/state.service";
import {AppTranslateModule} from "../../app-translate.module";
import {HttpClientModule} from "@angular/common/http";

describe('HomeModalComponent', () => {
  let component: HomeModalComponent;
  let fixture: ComponentFixture<HomeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeModalComponent],
      imports: [RouterTestingModule, AppTranslateModule, HttpClientModule],
      providers: [{
        provide: StateService,
        useValue: stateService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
