import { TestBed } from "@angular/core/testing";
import { DeploymentEnvironmentService } from "./deployment-environment.service";

describe("DeploymentEnvironmentService", () => {
  let service: DeploymentEnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeploymentEnvironmentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
