import { SpectatorService, createServiceFactory } from "@ngneat/spectator";
import {
  mockServiceImports,
  mockServiceProviders,
} from "@test/helpers/api-common";
import { WebsiteStatusService } from "./website-status.service";

describe("WebsiteStatusService", () => {
  let spec: SpectatorService<WebsiteStatusService>;

  const createService = createServiceFactory({
    service: WebsiteStatusService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  function setup(): void {
    spec = createService();

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date("2020-01-01T00:00:00.000+09:30"));
  }

  beforeEach(() => setup());

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(WebsiteStatusService);
  });
});
