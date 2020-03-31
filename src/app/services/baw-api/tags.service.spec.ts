import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { testAppInitializer } from "src/app/test.helper";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { TagsService } from "./tags.service";

describe("TagsService", () => {
  let service: TagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        TagsService,
        { provide: BawApiService, useClass: MockBawApiService }
      ]
    });
    service = TestBed.inject(TagsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
