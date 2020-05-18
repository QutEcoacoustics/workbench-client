import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TagsService } from "@baw-api/tag/tags.service";
import { Tag } from "@models/Tag";
import { SharedModule } from "@shared/shared.module";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { testBawServices } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.module";
import { AdminTagsComponent } from "./list.component";

describe("AdminTagsComponent", () => {
  let api: TagsService;
  let defaultModel: Tag;
  let defaultModels: Tag[];
  let fixture: ComponentFixture<AdminTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminTagsComponent],
      providers: [...testBawServices],
    }).compileComponents();
  }));

  beforeEach(function () {
    fixture = TestBed.createComponent(AdminTagsComponent);
    api = TestBed.inject(TagsService);

    defaultModel = new Tag({
      id: 1,
      text: "tag",
      isTaxanomic: false,
      retired: false,
      typeOfTag: "common",
    });
    defaultModels = [];
    for (let i = 0; i < 25; i++) {
      defaultModels.push(
        new Tag({
          id: i,
          text: "tag " + i,
          isTaxanomic: false,
          retired: false,
          typeOfTag: "common",
        })
      );
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  // TODO Write tests
  assertPagination<Tag, TagsService>();

  xdescribe("rows", () => {});
  xdescribe("actions", () => {});
});
