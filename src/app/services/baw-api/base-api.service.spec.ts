import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { SessionUser } from "src/app/models/User";
import { BawApiService } from "./base-api.service";
import { mockSessionStorage } from "./mock/sessionStorageMock";

describe("BawApiService", () => {
  let service: BawApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [...testAppInitializer]
    });
    service = TestBed.get(BawApiService);
    httpMock = TestBed.get(HttpTestingController);

    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage
    });
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should not change session storage on first load", () => {
    expect(sessionStorage.length).toBe(0);
  });

  it("should not be logged in", () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it("should not return user", () => {
    expect(service.getSessionUser()).toBe(null);
  });

  it("should be logged in after user saved to session storage", () => {
    const user = new SessionUser({
      authToken: "aaaaaaaaaaaaaaaaaaaaaa",
      userName: "username"
    });
    sessionStorage.setItem("user", JSON.stringify(user));
    expect(service.isLoggedIn()).toBeTruthy();
  });

  it("should return user after user saved to session storage", () => {
    const user = new SessionUser({
      authToken: "aaaaaaaaaaaaaaaaaaaaaa",
      userName: "username"
    });
    sessionStorage.setItem("user", JSON.stringify(user));
    expect(service.getSessionUser()).toBeTruthy();
    expect(service.getSessionUser().authToken).toBe("aaaaaaaaaaaaaaaaaaaaaa");
    expect(service.getSessionUser().userName).toBe("username");
  });

  it("makeTemplate should handle no tokens", () => {
    const template = service["makeTemplate"]`/broken_link`;

    expect(template).toBeTruthy();
    expect(template()).toBe("/broken_link");
  });

  it("makeTemplate should handle string token", () => {
    const stringCallback = (x: string) => x;
    const template = service["makeTemplate"]`/broken_link/${stringCallback}`;

    expect(template).toBeTruthy();
    expect(template("string")).toBe("/broken_link/string");
  });

  it("makeTemplate should handle number token", () => {
    const numberCallback = (x: number) => x;
    const template = service["makeTemplate"]`/broken_link/${numberCallback}`;

    expect(template).toBeTruthy();
    expect(template(42)).toBe("/broken_link/42");
  });

  it("makeTemplate should handle multiple string tokens", () => {
    const stringCallback = (x: string) => x;
    const template = service[
      "makeTemplate"
    ]`/broken_link/${stringCallback}/${stringCallback}`;

    expect(template).toBeTruthy();
    expect(template("ping", "pong")).toBe("/broken_link/ping/pong");
  });

  it("makeTemplate should handle multiple number tokens", () => {
    const numberCallback = (x: number) => x;
    const template = service[
      "makeTemplate"
    ]`/broken_link/${numberCallback}/${numberCallback}`;

    expect(template).toBeTruthy();
    expect(template(1, 2)).toBe("/broken_link/1/2");
  });

  it("makeTemplate should handle multiple different tokens", () => {
    const stringCallback = (x: string) => x;
    const numberCallback = (x: number) => x;
    const template = service[
      "makeTemplate"
    ]`/broken_link/${stringCallback}/${numberCallback}`;

    expect(template).toBeTruthy();
    expect(template("string", 42)).toBe("/broken_link/string/42");
  });
});
