import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AudioEvent } from '@models/AudioEvent';
import { MockAppConfigModule } from '@services/app-config/app-configMock.module';
import { validateApiFilter } from '@test/helpers/api-common';
import { ShallowAudioEventsService } from './audio-events.service';

describe('Shallow AudioEventsService', function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ShallowAudioEventsService],
    });

    this.service = TestBed.inject(ShallowAudioEventsService);
  });

  validateApiFilter<AudioEvent, ShallowAudioEventsService>(
    '/audio_events/filter'
  );

  // TODO Add unit tests for filterByCreator
});
