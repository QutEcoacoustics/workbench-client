import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Site } from '@models/Site';
import { MockAppConfigModule } from '@services/app-config/app-configMock.module';
import { generateSite } from '@test/fakes/Site';
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from '@test/helpers/api-common';
import { ShallowSitesService } from './sites.service';

describe('ShallowSitesService', function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ShallowSitesService],
    });

    this.service = TestBed.inject(ShallowSitesService);
  });

  validateApiList<Site, ShallowSitesService>('/sites/');
  validateApiFilter<Site, ShallowSitesService>('/sites/filter');
  validateApiShow<Site, ShallowSitesService>(
    '/sites/5',
    5,
    new Site(generateSite(5))
  );
  validateApiCreate<Site, ShallowSitesService>(
    '/sites/',
    new Site(generateSite(5))
  );
  validateApiUpdate<Site, ShallowSitesService>(
    '/sites/5',
    new Site(generateSite(5))
  );
  validateApiDestroy<Site, ShallowSitesService>(
    '/sites/5',
    5,
    new Site(generateSite(5))
  );

  // TODO Add tests for filterByCreator, orphanList, and orphanFilter
});
