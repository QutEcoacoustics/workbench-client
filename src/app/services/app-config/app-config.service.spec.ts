import { TestBed } from "@angular/core/testing";
import { providers } from "src/app/app.helper";
import { AppConfigService } from "./app-config.service";

describe("AppConfigService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [...providers]
    })
  );

  it("should be created", () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    expect(service).toBeTruthy();
  });
});
