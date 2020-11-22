import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { defaultApiPageSize } from '@baw-api/baw-api.service';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { TagGroupsService } from '@baw-api/tag/tag-group.service';
import { TagGroup } from '@models/TagGroup';
import { SharedModule } from '@shared/shared.module';
import { generateTagGroup } from '@test/fakes/TagGroup';
import { assertPagination } from '@test/helpers/pagedTableTemplate';
import { appLibraryImports } from 'src/app/app.module';
import { AdminTagGroupsComponent } from './list.component';

describe('AdminTagGroupsComponent', () => {
  let api: TagGroupsService;
  let defaultModel: TagGroup;
  let defaultModels: TagGroup[];
  let fixture: ComponentFixture<AdminTagGroupsComponent>;

  beforeEach(function () {
    TestBed.configureTestingModule({
      declarations: [AdminTagGroupsComponent],
      imports: [
        SharedModule,
        RouterTestingModule,
        ...appLibraryImports,
        MockBawApiModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagGroupsComponent);
    api = TestBed.inject(TagGroupsService);

    defaultModel = new TagGroup(generateTagGroup());
    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new TagGroup(generateTagGroup()));
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  // TODO Write tests
  assertPagination<TagGroup, TagGroupsService>();

  xdescribe('rows', () => {});
  xdescribe('actions', () => {});
});
