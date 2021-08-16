import { Injector } from "@angular/core";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AUDIO_RECORDING, SHALLOW_AUDIO_EVENT } from "@baw-api/ServiceTokens";
import { StatisticsService } from "@baw-api/statistics/statistics.service";
import { Errorable } from "@helpers/advancedTypes";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
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
import { generateStatistics } from "@test/fakes/Statistics";
import {
  interceptFilterApiRequest,
  interceptShowApiRequest,
} from "@test/helpers/general";
import { MockComponent } from "ng-mocks";
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

  function interceptStatisticsRequest(
    data: Errorable<IStatistics>
  ): Promise<any> {
    return interceptShowApiRequest(statsApi, injector, data, Statistics);
  }

  function interceptAudioEventsRequest(
    data: Errorable<AudioEvent[]>
  ): Promise<any> {
    return interceptFilterApiRequest(
      audioEventsApi,
      injector,
      data,
      AudioEvent
    );
  }

  function interceptAudioRecordingsRequest(
    data: Errorable<AudioRecording[]>
  ): Promise<any> {
    return interceptFilterApiRequest(
      audioRecordingsApi,
      injector,
      data,
      AudioRecording
    );
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
        new AudioEvent(generateAudioEvent({ id: 1 })),
        new AudioEvent(generateAudioEvent({ id: 2 })),
        new AudioEvent(generateAudioEvent({ id: 3 })),
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
