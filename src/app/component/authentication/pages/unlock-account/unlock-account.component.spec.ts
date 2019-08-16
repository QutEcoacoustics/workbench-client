import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyModule } from "@ngx-formly/core";
import { validationMessages } from "src/app/app.helper";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { UnlockPasswordComponent } from "./unlock-account.component";

describe("UnlockPasswordComponent", () => {
  let component: UnlockPasswordComponent;
  let fixture: ComponentFixture<UnlockPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormlyModule.forRoot({
          validationMessages
        })
      ],
      declarations: [UnlockPasswordComponent, HomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should eventually load form", () => {
    expect(fixture.nativeElement.querySelector("button")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("button").disabled).toBeFalsy();
  });

  it("should only contain one input", () => {
    expect(fixture.nativeElement.querySelectorAll("input").length).toBe(1);
  });

  it("should contain username/email input", () => {
    expect(fixture.nativeElement.querySelector("input")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("input").id).toContain("email");

    // API route expects email as id
    expect(fixture.nativeElement.querySelector("input").id).toContain("email");
  });

  xit("should unlock account on submit", () => {});
});
