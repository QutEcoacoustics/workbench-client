import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AudioRecording } from '@models/AudioRecording';
import { MockAppConfigModule } from '@services/app-config/app-configMock.module';
import { generateAudioRecording } from '@test/fakes/AudioRecording';
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from '@test/helpers/api-common';
import { AudioRecordingsService } from './audio-recordings.service';

describe('AudioRecordingsService', function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [AudioRecordingsService],
    });
    this.service = TestBed.inject(AudioRecordingsService);
  });

  validateApiList<AudioRecording, AudioRecordingsService>('/audio_recordings/');
  validateApiFilter<AudioRecording, AudioRecordingsService>(
    '/audio_recordings/filter'
  );
  validateApiShow<AudioRecording, AudioRecordingsService>(
    '/audio_recordings/5',
    5,
    new AudioRecording(generateAudioRecording(5))
  );
});
