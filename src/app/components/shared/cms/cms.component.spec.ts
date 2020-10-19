import { SafeHtml } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { CMS, CmsService } from "@baw-api/cms/cms.service";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { nStepObservable } from "@test/helpers/general";
import { assertSpinner } from "@test/helpers/html";
import { Subject } from "rxjs";
import { SharedModule } from "../shared.module";
import { CmsComponent } from "./cms.component";

describe("CmsComponent", () => {
  let cmsService: SpyObject<CmsService>;
  let component: CmsComponent;
  let spectator: Spectator<CmsComponent>;
  const createComponent = createComponentFactory({
    component: CmsComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
  });

  async function interceptApiRequest(
    response: string,
    error?: ApiErrorDetails,
    expectation: (page: string) => void = () => {}
  ) {
    const subject = new Subject<SafeHtml>();
    cmsService.get.andCallFake((page: string) => {
      expectation(page);
      return subject;
    });
    return nStepObservable(subject, () => (error ? error : response), !!error);
  }

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    component = spectator.component;
    cmsService = spectator.inject(CmsService);
  });

  it("should request page from api", async (done) => {
    const promise = interceptApiRequest("page content", undefined, (page) => {
      expect(page).toBe(CMS.HOME);
      done();
    });
    spectator.setInput("page", CMS.HOME);
    spectator.detectChanges();
    await promise;
  });

  it("should change request based on page", async (done) => {
    const promise = interceptApiRequest("page content", undefined, (page) => {
      expect(page).toBe(CMS.CREDITS);
      done();
    });
    spectator.setInput("page", CMS.CREDITS);
    spectator.detectChanges();
    await promise;
  });

  it("should initially display loading animation", () => {
    interceptApiRequest("page content");
    spectator.setInput("page", CMS.HOME);
    spectator.detectChanges();
    assertSpinner(spectator.fixture, true);
  });

  it("should hide loading animation after success response", async () => {
    const promise = interceptApiRequest("page content");
    spectator.setInput("page", CMS.HOME);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();
    assertSpinner(spectator.fixture, false);
  });

  it("should hide loading animation after error response", async () => {
    const promise = interceptApiRequest(undefined, generateApiErrorDetails());
    spectator.setInput("page", CMS.HOME);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();
    assertSpinner(spectator.fixture, false);
  });

  it("should display cms response containing plaintext", async () => {
    const promise = interceptApiRequest("cms content");
    spectator.setInput("page", CMS.HOME);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();

    const cms = spectator.query<HTMLElement>("#cms-content");
    expect(cms.innerText.trim()).toBe("cms content");
  });

  it("should display cms response containing html", async () => {
    const promise = interceptApiRequest(
      "<h1>Response</h1><p>Example HTML response from API</p>"
    );
    spectator.setInput("page", CMS.HOME);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();

    const header = spectator.query<HTMLElement>("h1");
    const body = spectator.query<HTMLElement>("p");
    expect(header.innerText.trim()).toBe("Response");
    expect(body.innerText.trim()).toBe("Example HTML response from API");
  });

  it("should display error message on failure", async () => {
    const error = generateApiErrorDetails();
    const promise = interceptApiRequest(undefined, error);
    spectator.setInput("page", CMS.HOME);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();

    const errorHandler = spectator.query(ErrorHandlerComponent);
    expect(errorHandler).toBeTruthy();
    expect(errorHandler.error).toEqual(error);
  });
});
