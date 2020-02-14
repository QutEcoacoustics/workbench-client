import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyModule } from "@ngx-formly/core";
import { formlyRoot } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testBawServices } from "src/app/test.helper";
import { RequestComponent } from "./request.component";

describe("ProjectsRequestComponent", () => {
  let component: RequestComponent;
  let fixture: ComponentFixture<RequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        SharedModule,
        FormlyModule.forRoot(formlyRoot)
      ],
      declarations: [RequestComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
