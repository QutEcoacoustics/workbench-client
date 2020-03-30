import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { testAppInitializer } from "src/app/test.helper";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { TagGroupService } from "./tag-group.service";

describe("TagGroupService", () => {
  let service: TagGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        TagGroupService,
        { provide: BawApiService, useClass: MockBawApiService }
      ]
    });
    service = TestBed.inject(TagGroupService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
