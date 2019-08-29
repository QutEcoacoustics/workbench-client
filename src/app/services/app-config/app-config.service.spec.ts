import { TestBed } from "@angular/core/testing";
import { AppConfigService } from "./app-config.service";

describe("AppConfigService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [AppConfigService] })
  );

  it("should be created", () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    expect(service).toBeTruthy();
  });
});
