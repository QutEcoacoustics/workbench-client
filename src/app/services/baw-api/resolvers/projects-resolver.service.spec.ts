import { TestBed } from "@angular/core/testing";
import { ProjectsResolverService } from "./projects-resolver.service";

describe("ProjectsResolverService", () => {
  let service: ProjectsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsResolverService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
