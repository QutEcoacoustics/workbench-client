import { TestBed } from "@angular/core/testing";
import { TagGroupService } from "./tag-group.service";

describe("TagGroupService", () => {
  let service: TagGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagGroupService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
