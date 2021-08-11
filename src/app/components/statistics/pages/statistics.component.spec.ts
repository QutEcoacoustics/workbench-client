import { Injector } from "@angular/core";
import { isErrorDetails } from "@baw-api/api.interceptor.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AUDIO_RECORDING, SHALLOW_AUDIO_EVENT } from "@baw-api/ServiceTokens";
import { StatisticsService } from "@baw-api/statistics/statistics.service";
import { Errorable } from "@helpers/advancedTypes";
import { AudioEvent, IAudioEvent } from "@models/AudioEvent";
import { AudioRecording, IAudioRecording } from "@models/AudioRecording";
import {
  IStatistics,
  IStatisticsRecent,
  IStatisticsSummary,
  Statistics,
} from "@models/Statistics";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { ItemsComponent } from "@shared/items/items/items.component";
import { SharedModule } from "@shared/shared.module";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import {
  generateStatistics,
  generateStatisticsRecent,
  generateStatisticsSummary,
} from "@test/fakes/Statistics";
import { nStepObservable } from "@test/helpers/general";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { RecentAnnotationsComponent } from "../components/recent-annotations/recent-annotations.component";
import { RecentAudioRecordingsComponent } from "../components/recent-audio-recordings/recent-audio-recordings.component";
import { StatisticsComponent } from "./statistics.component";

const mock = {
  recentAnnotationsComponent: MockComponent(RecentAnnotationsComponent),
  recentAudioRecordingsComponent: MockComponent(RecentAudioRecordingsComponent),
};

describe("StatisticsComponent", () => {
  let statsApi: SpyObject<StatisticsService>;
  let audioEventsApi: SpyObject<ShallowAudioEventsService>;
  let audioRecordingsApi: SpyObject<AudioRecordingsService>;
  let injector: Injector;
  let spec: Spectator<StatisticsComponent>;
  const createComponent = createComponentFactory({
    component: StatisticsComponent,
    imports: [SharedModule, MockBawApiModule],
    declarations: [
      mock.recentAnnotationsComponent,
      mock.recentAudioRecordingsComponent,
    ],
  });

  function sanitizeModel<T>(
    classBuilder: (data: Partial<T>) => T,
    modelData: Errorable<Partial<T>>
  ): { model: Errorable<T>; isError: boolean } {
    if (isErrorDetails(modelData)) {
      return { model: modelData, isError: true };
    }
    const model = classBuilder(modelData);
    return { model, isError: false };
  }

  function sanitizeModels<T>(
    classBuilder: (data: Partial<T>[]) => T[],
    modelData: Errorable<Partial<T>[]>
  ): { models: Errorable<T[]>; isError: boolean } {
    if (isErrorDetails(modelData)) {
      return { models: modelData, isError: true };
    }
    const models = classBuilder(modelData);
    console.log({ models });
    return { models, isError: false };
  }

  function interceptStatisticsRequest(
    data: Errorable<IStatistics>
  ): Promise<any> {
    const { model, isError } = sanitizeModel(
      (_data) => new Statistics(_data as IStatistics, injector),
      data
    );
    const subject = new Subject<Statistics>();
    statsApi.show.andCallFake(() => subject);
    return nStepObservable(subject, () => model, isError);
  }

  function interceptAudioEventsRequest(
    data: Errorable<AudioEvent[]>
  ): Promise<any> {
    const { models, isError } = sanitizeModels<AudioEvent>(
      (_data) =>
        _data.map(
          (modelData) => new AudioEvent(modelData as IAudioEvent, injector)
        ),
      data
    );
    const subject = new Subject<AudioEvent[]>();
    audioEventsApi.filter.andCallFake(() => subject);
    return nStepObservable(subject, () => models, isError);
  }

  function interceptAudioRecordingsRequest(
    data: Errorable<AudioRecording[]>
  ): Promise<any> {
    const { models, isError } = sanitizeModels<AudioRecording>(
      (_data) =>
        _data.map(
          (modelData) =>
            new AudioRecording(modelData as IAudioRecording, injector)
        ),
      data
    );
    const subject = new Subject<AudioRecording[]>();
    audioRecordingsApi.filter.andCallFake(() => subject);
    return nStepObservable(subject, () => models, isError);
  }

  function setup(
    statisticsData: Errorable<IStatistics> = generateStatistics(),
    audioEventsData: Errorable<AudioEvent[]> = [],
    audioRecordingsData: Errorable<AudioRecording[]> = []
  ): Promise<any> {
    spec = createComponent({ detectChanges: false });
    statsApi = spec.inject(StatisticsService);
    audioEventsApi = spec.inject(SHALLOW_AUDIO_EVENT.token);
    audioRecordingsApi = spec.inject(AUDIO_RECORDING.token);
    injector = spec.inject(Injector);

    return Promise.all([
      interceptStatisticsRequest(statisticsData),
      interceptAudioEventsRequest(audioEventsData),
      interceptAudioRecordingsRequest(audioRecordingsData),
    ]);
  }

  function getFirstItemsGroup() {
    return spec.queryAll(ItemsComponent)[0];
  }

  function getSecondItemsGroup() {
    return spec.queryAll(ItemsComponent)[1];
  }

  function partialStatistic(
    summary?: Partial<IStatisticsSummary>,
    recent?: Partial<IStatisticsRecent>
  ): Partial<IStatistics> {
    const partial: Partial<IStatistics> = {};
    if (summary) {
      partial.summary = summary as IStatisticsSummary;
    }
    if (recent) {
      partial.recent = recent as IStatisticsRecent;
    }
    return partial as Partial<IStatistics>;
  }

  xdescribe("group one", () => {
    function assertItem(index: number, value: string | number) {
      expect(getFirstItemsGroup().items.get(index).value).toBe(value);
    }

    it("should initially display unknown for values", () => {
      setup();
      spec.detectChanges();

      const itemGroup = getFirstItemsGroup();
      itemGroup.items.forEach((item) => expect(item.value).toBeFalsy());
    });

    [
      {
        test: "number of projects",
        index: 0,
        data: partialStatistic({ projectsTotal: 5 }),
        expectedOutput: 5,
      },
      {
        test: "number of annotations",
        index: 1,
        data: partialStatistic({ annotationsTotal: 5 }),
        expectedOutput: 5,
      },
      {
        test: "number of tags",
        index: 2,
        data: partialStatistic({ tagsTotal: 5 }),
        expectedOutput: 5,
      },
      {
        test: "number of sites",
        index: 3,
        data: partialStatistic({ sitesTotal: 5 }),
        expectedOutput: 5,
      },
      {
        test: "number of audio recordings",
        index: 4,
        data: partialStatistic({ audioRecordingsTotal: 5 }),
        expectedOutput: 5,
      },
      {
        test: "number of users",
        index: 5,
        data: partialStatistic({ usersTotal: 5 }),
        expectedOutput: 5,
      },
    ].forEach(({ test, index, data, expectedOutput }) => {
      it(`should display ${test}`, async () => {
        const promise = setup(generateStatistics(data.recent, data.summary));
        spec.detectChanges();
        await promise;
        spec.detectChanges();

        assertItem(index, expectedOutput);
      });
    });
  });

  xdescribe("group two", () => {
    function assertItem(index: number, value: string | number) {
      expect(getSecondItemsGroup().items.get(index).value).toBe(value);
    }

    it("should initially display unknown for values", () => {
      setup();
      spec.detectChanges();

      const itemGroup = getSecondItemsGroup();
      itemGroup.items.forEach((item) => expect(item.value).toBeFalsy());
    });

    [
      {
        test: "number of unique tags attached to annotations",
        index: 0,
        data: partialStatistic({ tagsAppliedUniqueTotal: 5 }),
        expectedOutput: 5,
      },
      {
        test: "number of tags attached to annotations",
        index: 1,
        data: partialStatistic({ tagsAppliedTotal: 5 }),
        expectedOutput: 5,
      },
      {
        test: "number of new annotations",
        index: 2,
        data: partialStatistic(undefined, { audioEventIds: [1, 2, 3] }),
        expectedOutput: 3,
      },
      {
        test: "overall annotation duration",
        index: 3,
        data: partialStatistic({ annotationsTotalDuration: 123456789 }),
        expectedOutput: "3 years, 11 months",
      },
      {
        test: "number of users online",
        index: 4,
        data: partialStatistic({ usersOnline: 5 }),
        expectedOutput: 5,
      },
      {
        test: "overall audio recording file size",
        index: 5,
        data: partialStatistic({ audioRecordingsTotalSize: 123456789 }),
        expectedOutput: "117.74 MB",
      },
      {
        test: "number of new audio recordings",
        index: 6,
        data: partialStatistic({ audioRecordingsRecent: 5 }),
        expectedOutput: 5,
      },
      {
        test: "overall audio duration",
        index: 7,
        data: partialStatistic({ audioRecordingsTotalDuration: 123456789 }),
        expectedOutput: "3 years, 11 months",
      },
    ].forEach(({ test, index, data, expectedOutput }) => {
      it(`should display ${test}`, async () => {
        const promise = setup(generateStatistics(data.recent, data.summary));
        spec.detectChanges();
        await promise;
        spec.detectChanges();

        assertItem(index, expectedOutput);
      });
    });
  });

  describe("recent models", () => {
    function getRecentAnnotations() {
      return spec.query(mock.recentAnnotationsComponent);
    }

    function getRecentAudioRecordings() {
      return spec.query(mock.recentAudioRecordingsComponent);
    }

    it("should display recent annotations", async () => {
      const audioEvents = [
        new AudioEvent(generateAudioEvent(1)),
        new AudioEvent(generateAudioEvent(2)),
        new AudioEvent(generateAudioEvent(3)),
      ];

      const promise = setup(
        generateStatistics({ audioEventIds: [1, 2, 3] }),
        audioEvents
      );
      spec.detectChanges();
      await promise;
      spec.detectChanges();

      console.log(getRecentAnnotations());
      console.log(spec.component.recent.audioEvents);

      expect(getRecentAnnotations().annotations).toEqual(audioEvents);
    });

    it("should display recent audio recordings", () => {});
  });
});
