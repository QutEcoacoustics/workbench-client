import { Spectator, createComponentFactory } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { WebsiteStatus } from "@models/WebsiteStatus";
import { generateWebsiteStatus } from "@test/fakes/WebsiteStatus";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ActivatedRoute } from "@angular/router";
import { KeysOfType } from "@helpers/advancedTypes";
import { WebsiteStatusWarningComponent } from "./website-status-warning.component";

describe("WebsiteCapabilityWarningComponent", () => {
  let spectator: Spectator<WebsiteStatusWarningComponent>;
  let mockApi: jasmine.SpyObj<WebsiteStatusService>;

  const createComponent = createComponentFactory({
    component: WebsiteStatusWarningComponent,
    imports: [MockBawApiModule],
    providers: [
      { provide: ActivatedRoute, useValue: mockActivatedRoute() },
      MockProvider(WebsiteStatusService),
    ],
  });

  const warningMessage = () => spectator.query(".alert", { root: true });

  function setup(
    mockWebsiteStatus = new WebsiteStatus(generateWebsiteStatus()),
    feature?: KeysOfType<WebsiteStatus, boolean>,
    message: string = ""
  ): void {
    spectator = createComponent({ detectChanges: false });

    mockApi = spectator.inject(WebsiteStatusService);
    mockApi.status$ = of(mockWebsiteStatus);

    jasmine.clock().install();

    spectator.component.feature = feature;
    spectator.component.message = message;

    spectator.detectChanges();
  }

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(WebsiteStatusWarningComponent);
  });

  it("should update correctly from healthy to unhealthy", () => {
    const goodWebsiteStatus = new WebsiteStatus(
      generateWebsiteStatus({
        upload: "Alive",
      })
    );

    const badWebsiteStatus = new WebsiteStatus(
      generateWebsiteStatus({
        upload: "Dead",
      })
    );

    setup(goodWebsiteStatus, "isUploadingHealthy");

    expect(warningMessage()).not.toExist();

    mockApi.status$ = of(badWebsiteStatus);
    spectator.detectChanges();

    expect(warningMessage()).toExist();
  });

  it("should update correctly from unhealthy to healthy", () => {
    const goodWebsiteStatus = new WebsiteStatus(
      generateWebsiteStatus({
        upload: "Alive",
      })
    );

    const badWebsiteStatus = new WebsiteStatus(
      generateWebsiteStatus({
        upload: "Dead",
      })
    );

    setup(badWebsiteStatus, "isUploadingHealthy");

    expect(warningMessage()).toExist();

    mockApi.status$ = of(goodWebsiteStatus);
    spectator.detectChanges();

    expect(warningMessage()).not.toExist();
  });

  it("should not display an error message for a healthy feature", () => {
    const mockWebsiteStatus = new WebsiteStatus(
      generateWebsiteStatus({
        upload: "Alive",
      })
    );

    setup(mockWebsiteStatus, "isUploadingHealthy", "upload audio");

    expect(warningMessage()).not.toExist();
  });

  it("should display an error message for an unhealthy feature", () => {
    const mockWebsiteStatus = new WebsiteStatus(
      generateWebsiteStatus({
        storage: "No audio recording storage directories are available.",
      })
    );

    setup(mockWebsiteStatus, "isStorageHealthy", "download audio");

    expect(warningMessage()).toExist();
  });
});
