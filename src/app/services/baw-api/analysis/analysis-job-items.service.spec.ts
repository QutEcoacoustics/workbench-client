import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalysisJobItem } from '@models/AnalysisJobItem';
import { MockAppConfigModule } from '@services/app-config/app-configMock.module';
import { generateAnalysisJobItem } from '@test/fakes/AnalysisJobItem';
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from '@test/helpers/api-common';
import { AnalysisJobItemsService } from './analysis-job-items.service';

describe('AnalysisJobItemsService', function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [AnalysisJobItemsService],
    });

    this.service = TestBed.inject(AnalysisJobItemsService);
  });

  validateApiList<AnalysisJobItem, AnalysisJobItemsService>(
    '/analysis_jobs/5/audio_recordings/',
    undefined,
    5
  );
  validateApiFilter<AnalysisJobItem, AnalysisJobItemsService>(
    '/analysis_jobs/5/audio_recordings/filter',
    undefined,
    undefined,
    5
  );
  validateApiShow<AnalysisJobItem, AnalysisJobItemsService>(
    '/analysis_jobs/5/audio_recordings/10',
    10,
    new AnalysisJobItem(generateAnalysisJobItem(10)),
    5
  );
});
