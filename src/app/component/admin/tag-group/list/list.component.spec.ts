import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import { assertPagination } from "src/app/test/helpers/pagedTableTemplate";
import { testBawServices } from "src/app/test/helpers/testbed";
import { AdminTagGroupsComponent } from "./list.component";

describe("AdminTagGroupsComponent", () => {
  let api: TagGroupsService;
  let defaultModel: TagGroup;
  let defaultModels: TagGroup[];
  let fixture: ComponentFixture<AdminTagGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTagGroupsComponent],
      imports: [SharedModule, RouterTestingModule, ...appLibraryImports],
      providers: [...testBawServices],
    }).compileComponents();
  }));

  beforeEach(function () {
    fixture = TestBed.createComponent(AdminTagGroupsComponent);
    api = TestBed.inject(TagGroupsService);

    defaultModel = new TagGroup({
      id: 1,
      tagId: 1,
      groupIdentifier: "",
    });
    defaultModels = [];
    for (let i = 0; i < 25; i++) {
      defaultModels.push(
        new TagGroup({
          id: 1,
          tagId: 1,
          groupIdentifier: "",
        })
      );
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  // TODO Write tests
  assertPagination<TagGroup, TagGroupsService>();

  xdescribe("rows", () => {});
  xdescribe("actions", () => {});
});
