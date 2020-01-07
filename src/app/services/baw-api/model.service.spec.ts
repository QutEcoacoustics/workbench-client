import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { BawApiService } from "./base-api.service";
import { MockBawApiService } from "./mock/baseApiMockService";
import { MOCK_CLASS_BUILDER, ModelService } from "./model.service";

describe("ModelService", () => {
  it("should be created", () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ...testAppInitializer,
        { provide: BawApiService, useClass: MockBawApiService },
        {
          provide: MOCK_CLASS_BUILDER,
          useValue: () => undefined
        },
        ModelService
      ]
    });
    const httpMock = TestBed.get(HttpTestingController);

    const service: ModelService<any> = TestBed.get(ModelService);
    expect(service).toBeTruthy();
  });

  /**
   * Detail tests
   */
  it("details should work no filter", () => {});
  it("details should work with filter", () => {});
  it("details should work with single argument no filter", () => {});
  it("details should work with single argument with filter", () => {});
  it("details should work with multiple arguments no filter", () => {});
  it("details should work with multiple arguments with filter", () => {});
  it("details should complete observable no filter", () => {});
  it("details should complete observable with filter", () => {});
  it("details should handle error no filter", () => {});
  it("details should handle error with filter", () => {});
  it("details should handle error with info no filter", () => {});
  it("details should handle error with info with filter", () => {});
  it("details should handle empty object output no filter", () => {});
  it("details should handle empty object output with filter", () => {});
  it("details should handle single object output no filter", () => {});
  it("details should handle single object output with filter", () => {});
  it("details should handle multiple object output no filter", () => {});
  it("details should handle multiple object output with filter", () => {});

  /**
   * Show tests
   */
  it("show should work no filter", () => {});
  it("show should work with filter", () => {});
  it("show should work with single argument no filter", () => {});
  it("show should work with single argument with filter", () => {});
  it("show should work with multiple arguments no filter", () => {});
  it("show should work with multiple arguments with filter", () => {});
  it("show should complete observable no filter", () => {});
  it("show should complete observable with filter", () => {});
  it("show should handle error no filter", () => {});
  it("show should handle error with filter", () => {});
  it("show should handle error with info no filter", () => {});
  it("show should handle error with info with filter", () => {});
  it("show should handle empty object output no filter", () => {});
  it("show should handle empty object output with filter", () => {});
  it("show should handle object output no filter", () => {});
  it("show should handle object output with filter", () => {});

  /**
   * New tests
   */
  it("new should work", () => {});
  it("new should work with single argument", () => {});
  it("new should work with multiple arguments", () => {});
  it("new should complete observable", () => {});
  it("new should handle empty values", () => {});
  it("new should handle single value", () => {});
  it("new should handle multiple values", () => {});
  it("new should handle error", () => {});
  it("new should handle error with info", () => {});
  it("new should handle empty object output", () => {});
  it("new should handle object output", () => {});

  /**
   * Update tests
   */
  it("update should work", () => {});
  it("update should work with single argument", () => {});
  it("update should work with multiple arguments", () => {});
  it("update should complete observable", () => {});
  it("update should handle empty values", () => {});
  it("update should handle single value", () => {});
  it("update should handle multiple values", () => {});
  it("update should handle error", () => {});
  it("update should handle error with info", () => {});
  it("update should handle empty object output", () => {});
  it("update should handle object output", () => {});
});
