import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AudioRecordingsService } from '@baw-api/audio-recording/audio-recordings.service';
import { defaultApiPageSize } from '@baw-api/baw-api.service';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { AudioRecording } from '@models/AudioRecording';
import { SharedModule } from '@shared/shared.module';
import { generateAudioRecording } from '@test/fakes/AudioRecording';
import { assertPagination } from '@test/helpers/pagedTableTemplate';
import { appLibraryImports } from 'src/app/app.module';
import { AdminAudioRecordingsComponent } from './list.component';

describe('AdminAudioRecordingsComponent', () => {
  let api: AudioRecordingsService;
  let defaultModel: AudioRecording;
  let defaultModels: AudioRecording[];
  let fixture: ComponentFixture<AdminAudioRecordingsComponent>;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminAudioRecordingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAudioRecordingsComponent);
    api = TestBed.inject(AudioRecordingsService);

    defaultModel = new AudioRecording(generateAudioRecording());
    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new AudioRecording(generateAudioRecording()));
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  // TODO Write Tests
  assertPagination<AudioRecording, AudioRecordingsService>();

  xdescribe('rows', () => {});
  xdescribe('actions', () => {});
});
