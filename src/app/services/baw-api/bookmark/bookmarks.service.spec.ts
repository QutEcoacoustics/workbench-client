import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Bookmark } from '@models/Bookmark';
import { MockAppConfigModule } from '@services/app-config/app-configMock.module';
import { generateBookmark } from '@test/fakes/Bookmark';
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from '@test/helpers/api-common';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksService', function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [BookmarksService],
    });

    this.service = TestBed.inject(BookmarksService);
  });

  validateApiList<Bookmark, BookmarksService>('/bookmarks/');
  validateApiFilter<Bookmark, BookmarksService>('/bookmarks/filter');
  // TODO Add unit tests for filterByCreator
  validateApiShow<Bookmark, BookmarksService>(
    '/bookmarks/5',
    5,
    new Bookmark(generateBookmark(5))
  );
  validateApiCreate<Bookmark, BookmarksService>(
    '/bookmarks/',
    new Bookmark(generateBookmark(5))
  );
  validateApiUpdate<Bookmark, BookmarksService>(
    '/bookmarks/5',
    new Bookmark(generateBookmark(5))
  );
  validateApiDestroy<Bookmark, BookmarksService>(
    '/bookmarks/5',
    5,
    new Bookmark(generateBookmark(5))
  );
});
