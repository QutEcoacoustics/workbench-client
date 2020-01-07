import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { BawApiService } from "./base-api.service";
import { MockBawApiService } from "./mock/baseApiMockService";
import { MOCK_CLASS_BUILDER, ModelService } from "./model.service";

describe("ModelService", () => {
  beforeEach(() =>
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
    })
  );

  it("should be created", () => {
    const service: ModelService<any> = TestBed.get(ModelService);
    expect(service).toBeTruthy();
  });
});
