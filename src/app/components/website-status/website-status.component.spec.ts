import { Spectator, createComponentFactory } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ServerTimeout, SsrContext, WebsiteStatus } from "@models/WebsiteStatus";
import { MockProvider } from "ng-mocks";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { generateWebsiteStatus } from "@test/fakes/WebsiteStatus";
import { WebsiteStatusComponent } from "./website-status.component";

interface GridItem {
  name: string;
  value: string;
}

describe("WebsiteStatusComponent", () => {
  let spectator: Spectator<WebsiteStatusComponent>;
  let userHasInternet: boolean;
  let mockApi: jasmine.SpyObj<WebsiteStatusService>;

  const createComponent = createComponentFactory({
    component: WebsiteStatusComponent,
    imports: [MockBawApiModule],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: mockActivatedRoute(),
      },
      MockProvider(WebsiteStatusService),
    ],
  });

  function setup(
    fakeWebsiteStatus = new WebsiteStatus(generateWebsiteStatus())
  ) {
    spectator = createComponent({ detectChanges: false });

    mockApi = spectator.inject(WebsiteStatusService);
    mockApi.status$ = new BehaviorSubject(fakeWebsiteStatus);

    spyOnProperty(navigator, "onLine", "get").and.callFake(
      () => userHasInternet
    );

    spectator.detectChanges();
  }

  function assertGridItemText(itemName: string, expectedValue: string) {
    const gridElement = spectator.query(`[ng-reflect-name="${itemName}"]`);
    const gridElementValue = gridElement.querySelector("#value");

    expect(gridElementValue).toHaveExactTrimmedText(expectedValue);
  }

  assertPageInfo(WebsiteStatusComponent, "Website Status");

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(WebsiteStatusComponent);
  });

  it("should display the correct text for a healthy response", () => {
    const expectedValues: GridItem[] = [
      { name: "Overall Server Health", value: "Healthy" },
      { name: "Server Connection", value: "Healthy" },
      { name: "Database", value: "Healthy" },
      { name: "Cache", value: "Healthy" },
      { name: "Storage", value: "Healthy" },
      { name: "User Uploads", value: "Healthy" },
      { name: "Batch Analysis", value: "Healthy" },
      { name: "User Internet Connection", value: "Healthy" },
    ];

    userHasInternet = true;
    const fakeWebsiteStatus = new WebsiteStatus({
      status: "good",
      database: true,
      timedOut: false,
      redis: "PONG",
      storage: "1 audio recording storage directory available.",
      upload: "Alive",
      batchAnalysis: "Connected",
    });

    setup(fakeWebsiteStatus);

    expectedValues.forEach((item) =>
      assertGridItemText(item.name, item.value.toString())
    );
  });

  it("should display the correct text for an unhealthy response", () => {
    const expectedValues: GridItem[] = [
      { name: "Overall Server Health", value: "Unhealthy" },
      { name: "Server Connection", value: "Unhealthy" },
      { name: "Database", value: "Unhealthy" },
      { name: "Cache", value: "Unhealthy" },
      { name: "Storage", value: "Unhealthy" },
      { name: "User Uploads", value: "Unhealthy" },
      { name: "Batch Analysis", value: "Unhealthy" },
      { name: "User Internet Connection", value: "Healthy" },
    ];

    userHasInternet = true;
    const fakeWebsiteStatus = new WebsiteStatus({
      status: "bad",
      database: false,
      timedOut: true,
      redis: "",
      storage: "No audio recording storage directories are available.",
      upload: "Dead",
      batchAnalysis: "Failed to connect",
    });

    setup(fakeWebsiteStatus);

    expectedValues.forEach((item) =>
      assertGridItemText(item.name, item.value.toString())
    );
  });

  it("should display the correct text for a partially healthy response", () => {
    const expectedValues: GridItem[] = [
      { name: "Overall Server Health", value: "Unhealthy" },
      { name: "Server Connection", value: "Healthy" },
      { name: "Database", value: "Unhealthy" },
      { name: "Cache", value: "Unhealthy" },
      { name: "Storage", value: "Healthy" },
      { name: "User Uploads", value: "Unhealthy" },
      { name: "Batch Analysis", value: "Healthy" },
      { name: "User Internet Connection", value: "Healthy" },
    ];

    userHasInternet = true;
    const fakeWebsiteStatus = new WebsiteStatus({
      status: "bad",
      timedOut: false,
      database: false,
      redis: "",
      storage: "1 audio recording storage directory available.",
      upload: "Dead",
      batchAnalysis: "Connected",
    });

    setup(fakeWebsiteStatus);

    expectedValues.forEach((item) =>
      assertGridItemText(item.name, item.value.toString())
    );
  });

  it("should display the correct text if the server does not give a response", () => {
    const expectedValues: GridItem[] = [
      { name: "Overall Server Health", value: "Unknown" },
      { name: "Server Connection", value: "Unhealthy" },
      { name: "Database", value: "Unknown" },
      { name: "Cache", value: "Unknown" },
      { name: "Storage", value: "Unknown" },
      { name: "User Uploads", value: "Unknown" },
      { name: "Batch Analysis", value: "Unknown" },
      { name: "User Internet Connection", value: "Healthy" },
    ];

    userHasInternet = true;
    const fakeWebsiteStatus = ServerTimeout.instance;

    setup(fakeWebsiteStatus);

    expectedValues.forEach((item) =>
      assertGridItemText(item.name, item.value.toString())
    );
  });

  it("should display the correct text if in a SSR context", () => {
    const expectedValue: GridItem[] = [
      { name: "Overall Server Health", value: "Unknown" },
      { name: "Server Connection", value: "Unknown" },
      { name: "Database", value: "Unknown" },
      { name: "Cache", value: "Unknown" },
      { name: "Storage", value: "Unknown" },
      { name: "User Uploads", value: "Unknown" },
      { name: "Batch Analysis", value: "Unknown" },
      { name: "User Internet Connection", value: "Unhealthy" },
    ];

    userHasInternet = false;
    const fakeWebsiteStatus = SsrContext.instance;

    setup(fakeWebsiteStatus);

    expectedValue.forEach((item) =>
      assertGridItemText(item.name, item.value.toString())
    );
  });
});
