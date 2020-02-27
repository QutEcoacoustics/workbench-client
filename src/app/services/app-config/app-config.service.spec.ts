import { TestBed } from "@angular/core/testing";
import { ToastrModule } from "ngx-toastr";
import { toastrRoot } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { AppConfigService } from "./app-config.service";

describe("AppConfigService", () => {
  let service: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ToastrModule.forRoot(toastrRoot)]
    });
    service = TestBed.inject(AppConfigService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
