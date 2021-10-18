import {ComponentFixture, TestBed} from "@angular/core/testing";

import {NewProjectComponent} from "./new-project.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe("NewProjectComponent", () => {

  let component: NewProjectComponent;
  let fixture: ComponentFixture<NewProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewProjectComponent],
      imports: [FormsModule, ReactiveFormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProjectComponent);
    component = fixture.componentInstance;
    component.data = {
      name: "",
      file: ""
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
