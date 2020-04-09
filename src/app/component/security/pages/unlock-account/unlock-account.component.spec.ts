import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "@component/home/home.component";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { appLibraryImports } from "src/app/app.module";
import { testAppInitializer } from "src/app/test.helper";
import { testFormlyFields } from "src/testHelpers";
import { UnlockAccountComponent } from "./unlock-account.component";
import { fields } from "./unlock-account.json";

describe("UnlockAccountComponent", () => {
  let component: UnlockAccountComponent;
  let fixture: ComponentFixture<UnlockAccountComponent>;
  let notifications: ToastrService;

  const formInputs = [
    {
      testGroup: "Username/Email Address Input",
      setup: undefined,
      field: fields[0],
      key: "login",
      htmlType: "input",
      required: true,
      label: "Username or Email Address",
      type: "text",
      description: undefined,
    },
  ];

  describe("form", () => {
    testFormlyFields(formInputs);
  });

  describe("component", () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [...appLibraryImports, SharedModule],
        declarations: [UnlockAccountComponent, HomeComponent],
        providers: [...testAppInitializer],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(UnlockAccountComponent);
      component = fixture.componentInstance;
      notifications = TestBed.inject(ToastrService);
      fixture.detectChanges();

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    // TODO should call api
    xit("should call api", () => {});
  });
});
