// import {
//   HttpClientTestingModule,
//   HttpTestingController
// } from "@angular/common/http/testing";
// import { TestBed } from "@angular/core/testing";
// import { testAppInitializer } from "src/app/app.helper";
// import { SessionUser } from "src/app/models/User";
// import { BawApiService } from "./base-api.service";
// import { mockSessionStorage } from "./mock/sessionStorageMock";

// describe("BawApiService", () => {
//   let service: BawApiService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [...testAppInitializer]
//     });
//     service = TestBed.get(BawApiService);
//     httpMock = TestBed.get(HttpTestingController);

//     Object.defineProperty(window, "sessionStorage", {
//       value: mockSessionStorage
//     });
//   });

//   afterEach(() => {
//     sessionStorage.clear();
//     httpMock.verify();
//   });

//   it("should be created", () => {
//     expect(service).toBeTruthy();
//   });

//   it("should not change session storage on first load", () => {
//     expect(sessionStorage.length).toBe(0);
//   });

//   it("should not be logged in", () => {
//     expect(service.isLoggedIn()).toBe(false);
//   });

//   it("should not return user", () => {
//     expect(service.getSessionUser()).toBe(null);
//   });

//   it("should be logged in after user saved to session storage", () => {
//     const user = new SessionUser({
//       authToken: "aaaaaaaaaaaaaaaaaaaaaa",
//       userName: "username"
//     });
//     sessionStorage.setItem("user", JSON.stringify(user));
//     expect(service.isLoggedIn()).toBeTruthy();
//   });

//   it("should return user after user saved to session storage", () => {
//     const user = new SessionUser({
//       authToken: "aaaaaaaaaaaaaaaaaaaaaa",
//       userName: "username"
//     });
//     sessionStorage.setItem("user", JSON.stringify(user));
//     expect(service.getSessionUser()).toBeTruthy();
//     expect(service.getSessionUser().authToken).toBe("aaaaaaaaaaaaaaaaaaaaaa");
//     expect(service.getSessionUser().userName).toBe("username");
//   });
// });
