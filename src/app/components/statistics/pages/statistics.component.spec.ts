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
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateStatistics } from "@test/fakes/Statistics";
import {
  interceptFilterApiRequest,
  interceptShowApiRequest,
} from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { MockComponent } from "ng-mocks";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Id } from "@interfaces/apiInterfaces";
import { of } from "rxjs";
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
  let mockAudioRecordingResponses: Map<Id, Errorable<AudioRecording>>;
  let injector: AssociationInjector;
  let spec: Spectator<StatisticsComponent>;

  const createComponent = createComponentFactory({
    component: StatisticsComponent,
    imports: [SharedModule, MockBawApiModule],
    declarations: [
      mock.recentAnnotationsComponent,
      mock.recentAudioRecordingsComponent,
    ],
  });

  assertPageInfo(StatisticsComponent, "Statistics");

  function interceptStatisticsRequest(
    data: Errorable<IStatistics>
  ): Promise<any> {
    return interceptShowApiRequest(statsApi, injector, data, Statistics);
  }

  function interceptAudioEventsRequests(
    data: Errorable<AudioEvent>[]
  ): Promise<any> {
    return interceptFilterApiRequest(
      audioEventsApi,
      injector,
      data,
      AudioEvent
    );
  }

  function interceptAudioRecordingsRequests(data: AudioRecording[]) {
    for (const audioRecording of data) {
      mockAudioRecordingResponses.set(audioRecording.id, audioRecording);
    }

    audioRecordingsApi.show.and.callFake((modelId: Id) =>
      of(mockAudioRecordingResponses.get(modelId))
    );
  }

  function setup(
    statisticsData: Errorable<IStatistics> = generateStatistics(),
    audioEventsData: Errorable<AudioEvent>[] = [],
    audioRecordingsData: AudioRecording[] = []
  ): { initial: Promise<any>; final: Promise<any> } {
    mockAudioRecordingResponses = new Map();

    spec = createComponent({ detectChanges: false });
    statsApi = spec.inject(StatisticsService);
    audioEventsApi = spec.inject(SHALLOW_AUDIO_EVENT.token);
    audioRecordingsApi = spec.inject(AUDIO_RECORDING.token);
    injector = spec.inject(ASSOCIATION_INJECTOR);

    return {
      initial: interceptStatisticsRequest(statisticsData),
      final: Promise.all([
        interceptAudioEventsRequests(audioEventsData),
        interceptAudioRecordingsRequests(audioRecordingsData),
      ]),
    };
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

  describe("group one", () => {
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
        await promise.initial;
        spec.detectChanges();

        assertItem(index, expectedOutput);
      });
    });
  });

  describe("group two", () => {
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
        expectedOutput: "3 years 11 months",
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
        expectedOutput: "123.46 MB",
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
        expectedOutput: "3 years 11 months",
      },
    ].forEach(({ test, index, data, expectedOutput }) => {
      it(`should display ${test}`, async () => {
        const promise = setup(generateStatistics(data.recent, data.summary));
        spec.detectChanges();
        await promise.initial;
        spec.detectChanges();

        assertItem(index, expectedOutput);
      });
    });
  });

  describe("recent models", () => {
    function getRecentAnnotations() {
      return spec.query(RecentAnnotationsComponent);
    }

    function getRecentAudioRecordings() {
      return spec.query(RecentAudioRecordingsComponent);
    }

    it("should display recent annotations", async () => {
      const audioEvents = [1, 2, 3].map(
        (id) => new AudioEvent(generateAudioEvent({ id }))
      );
      const promise = setup(
        generateStatistics({ audioEventIds: [1, 2, 3] }),
        audioEvents
      );

      spec.detectChanges();
      await promise.initial;
      spec.detectChanges();
      await promise.final;
      spec.detectChanges();
      expect(getRecentAnnotations().annotations).toEqual(audioEvents);
    });

    fit("should display recent audio recordings", async () => {
      const audioRecordingIds = [1, 2, 3];
      const audioRecordings = audioRecordingIds.map(
        (id) => new AudioRecording(generateAudioRecording({ id }))
      );

      const promise = setup(
        generateStatistics({ audioRecordingIds }),
        [],
        audioRecordings
      );

      spec.detectChanges();
      await promise.initial;
      spec.detectChanges();
      await promise.final;
      spec.detectChanges();

      expect(getRecentAudioRecordings().audioRecordings).toEqual(
        audioRecordings
      );
    });
  });
});
