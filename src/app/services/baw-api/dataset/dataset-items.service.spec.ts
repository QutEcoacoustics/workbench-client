import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DatasetItem } from '@models/DatasetItem';
import { MockAppConfigModule } from '@services/app-config/app-configMock.module';
import { generateDatasetItem } from '@test/fakes/DatasetItem';
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from '@test/helpers/api-common';
import { DatasetItemsService } from './dataset-items.service';

describe('DatasetItemsService', function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [DatasetItemsService],
    });

    this.service = TestBed.inject(DatasetItemsService);
  });

  validateApiList<DatasetItem, DatasetItemsService>(
    '/datasets/5/items/',
    undefined,
    5
  );
  validateApiFilter<DatasetItem, DatasetItemsService>(
    '/datasets/5/items/filter',
    undefined,
    undefined,
    5
  );
  validateApiShow<DatasetItem, DatasetItemsService>(
    '/datasets/5/items/10',
    10,
    new DatasetItem(generateDatasetItem(10)),
    5
  );
  validateApiCreate<DatasetItem, DatasetItemsService>(
    '/datasets/5/items/',
    new DatasetItem(generateDatasetItem(10)),
    5
  );
  validateApiDestroy<DatasetItem, DatasetItemsService>(
    '/datasets/5/items/10',
    10,
    new DatasetItem(generateDatasetItem(10)),
    5
  );
});
