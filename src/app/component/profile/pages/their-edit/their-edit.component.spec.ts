import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { formlyRoot } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testBawServices } from "src/app/test.helper";
import { TheirEditComponent } from "./their-edit.component";

describe("TheirProfileEditComponent", () => {
  let component: TheirEditComponent;
  let fixture: ComponentFixture<TheirEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        HttpClientTestingModule,
        FormlyModule.forRoot(formlyRoot)
      ],
      declarations: [TheirEditComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheirEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
