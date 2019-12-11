import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyCustomModule } from "src/app/helpers/formly/formly.module";
import { SharedModule } from "../shared/shared.module";
import { DataRequestComponent } from "./data-request.component";

describe("DataRequestComponent", () => {
  let component: DataRequestComponent;
  let fixture: ComponentFixture<DataRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, FormlyCustomModule],
      declarations: [DataRequestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
