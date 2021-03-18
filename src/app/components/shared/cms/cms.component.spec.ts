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

  it("should request page from api", (done) => {
    interceptApiRequest("page content", undefined, (page) => {
      expect(page).toBe(CMS.home);
      done();
    });
    spectator.setInput("page", CMS.home);
    spectator.detectChanges();
  });

  it("should change request based on page", (done) => {
    interceptApiRequest("page content", undefined, (page) => {
      expect(page).toBe(CMS.credits);
      done();
    });
    spectator.setInput("page", CMS.credits);
    spectator.detectChanges();
  });

  it("should initially display loading animation", () => {
    interceptApiRequest("page content");
    spectator.setInput("page", CMS.home);
    spectator.detectChanges();
    assertSpinner(spectator.fixture, true);
  });

  it("should hide loading animation after success response", async () => {
    const promise = interceptApiRequest("page content");
    spectator.setInput("page", CMS.home);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();
    assertSpinner(spectator.fixture, false);
  });

  it("should hide loading animation after error response", async () => {
    const promise = interceptApiRequest(undefined, generateApiErrorDetails());
    spectator.setInput("page", CMS.home);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();
    assertSpinner(spectator.fixture, false);
  });

  it("should display cms response containing plaintext", async () => {
    const promise = interceptApiRequest("cms content");
    spectator.setInput("page", CMS.home);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();

    expect(spectator.element.innerText.trim()).toBe("cms content");
  });

  it("should display cms response containing html", async () => {
    const promise = interceptApiRequest(`
      <h1>Response</h1>
      <p>Example HTML response from API</p>
    `);
    spectator.setInput("page", CMS.home);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();

    const header = spectator.debugElement.nativeElement.querySelector("h1");
    const body = spectator.debugElement.nativeElement.querySelector("p");
    expect(header.innerText.trim()).toBe("Response");
    expect(body.innerText.trim()).toBe("Example HTML response from API");
  });

  it("should display cms response containing style tag", async () => {
    const promise = interceptApiRequest(`
      <style>p { color: #420; }</style>
      <p>Example HTML response from API</p>
    `);
    spectator.setInput("page", CMS.home);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();

    const body = spectator.debugElement.nativeElement.querySelector("p");
    expect(body.innerText.trim()).toBe("Example HTML response from API");
    expect(body).toHaveStyle({ color: "#420" });
  });

  it("should display cms response containing script tag", async () => {
    const promise = interceptApiRequest(`
      <p id='test'>Example HTML response from API</p>
      <script>document.getElementById('test').style.color = '#420';</script>
    `);
    spectator.setInput("page", CMS.home);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();

    const body = spectator.debugElement.nativeElement.querySelector("p");
    expect(body.innerText.trim()).toBe("Example HTML response from API");
    expect(body).toHaveStyle({ color: "#420" });
  });

  it("should display error message on failure", async () => {
    const error = generateApiErrorDetails();
    const promise = interceptApiRequest(undefined, error);
    spectator.setInput("page", CMS.home);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();

    const errorHandler = spectator.query(ErrorHandlerComponent);
    expect(errorHandler).toBeTruthy();
    expect(errorHandler.error).toEqual(error);
  });
});
