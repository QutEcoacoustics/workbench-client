import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalysisJobsService } from '@baw-api/analysis/analysis-jobs.service';
import { defaultApiPageSize } from '@baw-api/baw-api.service';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { AnalysisJob } from '@models/AnalysisJob';
import { SharedModule } from '@shared/shared.module';
import { generateAnalysisJob } from '@test/fakes/AnalysisJob';
import { assertPagination } from '@test/helpers/pagedTableTemplate';
import { appLibraryImports } from 'src/app/app.module';
import { AdminAnalysisJobsComponent } from './list.component';

describe('AdminAnalysisJobsComponent', () => {
  let api: AnalysisJobsService;
  let defaultModel: AnalysisJob;
  let defaultModels: AnalysisJob[];
  let fixture: ComponentFixture<AdminAnalysisJobsComponent>;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminAnalysisJobsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAnalysisJobsComponent);
    api = TestBed.inject(AnalysisJobsService);

    defaultModel = new AnalysisJob(generateAnalysisJob());
    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new AnalysisJob(generateAnalysisJob()));
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  assertPagination<AnalysisJob, AnalysisJobsService>();

  // TODO Write Tests
  xdescribe('rows', () => {});
  xdescribe('actions', () => {});
});
