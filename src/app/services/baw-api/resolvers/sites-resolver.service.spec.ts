import { TestBed } from "@angular/core/testing";
import { SitesResolverService } from "./sites-resolver.service";

describe("SitesResolverService", () => {
  let service: SitesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SitesResolverService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
