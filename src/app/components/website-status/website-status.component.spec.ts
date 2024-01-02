import { Spectator, createComponentFactory } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { WebsiteStatus } from "@models/WebsiteStatus";
import { MockProvider } from "ng-mocks";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { of } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { WebsiteStatusComponent } from "./website-status.component";

interface GridItem {
  name: string;
  value: string;
}

describe("WebsiteStatusComponent", () => {
  let spectator: Spectator<WebsiteStatusComponent>;
  let fakeWebsiteStatus: WebsiteStatus;
  let userHasInternet: boolean;
  let mockApi: jasmine.SpyObj<WebsiteStatusService>;

  const createComponent = createComponentFactory({
    component: WebsiteStatusComponent,
    imports: [SharedModule, MockBawApiModule],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: mockActivatedRoute(),
      },
      MockProvider(WebsiteStatusService),
    ],
  });

  function setup() {
    spectator = createComponent({ detectChanges: false });

    mockApi = spectator.inject(WebsiteStatusService);

    // we use a callback here so that we can set the "fakeWebsiteStatus" value emitted by the
    // fake api without us having to re-mock the api
    mockApi.show = jasmine
      .createSpy("show")
      .and.callFake(() => of(fakeWebsiteStatus));

    spyOnProperty(navigator, "onLine", "get").and.callFake(() => userHasInternet);

    spectator.detectChanges();
  }

  function assertGridItemText(itemName: string, expectedValue: string) {
    const gridElement = spectator.query(`[ng-reflect-name="${itemName}"]`);
    const gridElementValue = gridElement.querySelector("#value");

    expect(gridElementValue).toHaveExactTrimmedText(expectedValue);
  }

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(WebsiteStatusComponent);
  });

  it("should call the api once correctly", () => {
    setup();
    // intentionally left the body of "OnceWith" empty because it should be a GET request
    expect(mockApi.show).toHaveBeenCalledOnceWith();
  });

  it("should display the correct text for a healthy response", () => {
    const expectedValues: GridItem[] = [
      { name: "Overall Server Health", value: "Healthy" },
      { name: "Server Connection", value: "Healthy" },
      { name: "Database", value: "Healthy" },
      { name: "Cache", value: "Healthy" },
      { name: "Storage", value: "Healthy" },
      { name: "User Uploads", value: "Healthy" },
      { name: "User Internet Connection", value: "Healthy" },
    ];

    userHasInternet = true;
    fakeWebsiteStatus = new WebsiteStatus({
      status: "good",
      database: true,
      timedOut: false,
      redis: "PONG",
      storage: "1 audio recording storage directory available.",
      upload: "Alive",
    });

    setup();

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
      { name: "User Internet Connection", value: "Healthy" },
    ];

    userHasInternet = true;
    fakeWebsiteStatus = new WebsiteStatus({
      status: "bad",
      database: false,
      timedOut: true,
      redis: "",
      storage: "No audio recording storage directories are available.",
      upload: "Dead",
    });

    setup();

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
      { name: "User Internet Connection", value: "Healthy" },
    ];

    userHasInternet = true;
    fakeWebsiteStatus = new WebsiteStatus({
      status: "bad",
      timedOut: false,
      database: false,
      redis: "",
      storage: "1 audio recording storage directory available.",
      upload: "Dead",
    });

    setup();

    expectedValues.forEach((item) =>
      assertGridItemText(item.name, item.value.toString())
    );
  });

  it("should display the correct text for a response with no internet connection", () => {
    const expectedValues: GridItem[] = [
      { name: "Overall Server Health", value: "Unknown" },
      { name: "Server Connection", value: "Unknown" },
      { name: "Database", value: "Unknown" },
      { name: "Cache", value: "Unknown" },
      { name: "Storage", value: "Unknown" },
      { name: "User Uploads", value: "Unknown" },
      { name: "User Internet Connection", value: "Unhealthy" },
    ];

    userHasInternet = false;
    fakeWebsiteStatus = null;

    setup();

    expectedValues.forEach((item) =>
      assertGridItemText(item.name, item.value.toString())
    );
  });
});
