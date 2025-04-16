import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import {
  createRoutingFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateSite } from "@test/fakes/Site";
import { nStepObservable } from "@test/helpers/general";
import { assertSpinner } from "@test/helpers/html";
import { BehaviorSubject, Subject } from "rxjs";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { DownloadTableComponent } from "./download-table.component";

describe("DownloadTableComponent", () => {
  let defaultSite: Site;
  let defaultRecording: AudioRecording;
  let injector: AssociationInjector;
  let siteApi: SpyObject<ShallowSitesService>;
  let recordingApi: SpyObject<AudioRecordingsService>;
  let spec: Spectator<DownloadTableComponent>;

  const createComponent = createRoutingFactory({
    component: DownloadTableComponent,
    imports: [MockBawApiModule],
  });

  function interceptRecordingsApi(recordings: AudioRecording[]) {
    // Set metadata
    recordings.forEach((recording) =>
      recording.addMetadata({
        paging: { total: recordings.length, items: recordings.length },
      })
    );

    const subject = new Subject<AudioRecording[]>();
    recordingApi.filter.and.callFake(() => subject);
    return nStepObservable(subject, () => recordings);
  }

  function interceptSitesApi(site: Site) {
    const subject = new Subject<Site>();
    siteApi.show.and.callFake(() => subject);
    return nStepObservable(subject, () => site);
  }

  function setup(filters$: BehaviorSubject<Filters<AudioRecording>>): void {
    spec = createComponent({ detectChanges: false, props: { filters$ } });
    recordingApi = spec.inject(AudioRecordingsService);
    siteApi = spec.inject(SHALLOW_SITE.token);
    injector = spec.inject(ASSOCIATION_INJECTOR);
    // injector = spec.inject(Injector as any);
    // console.log("service", injector.get(ToastsService));
    defaultRecording = new AudioRecording(generateAudioRecording(), injector);
    defaultSite = new Site(generateSite(), injector);
  }

  function getRowItem(columnIndex: number): HTMLElement {
    return spec.query(`datatable-body-cell:nth-child(${columnIndex + 1})`);
  }

  async function loadRows(recordings: AudioRecording[], site: Site) {
    const recordingPromise = interceptRecordingsApi(recordings);
    const sitePromise = interceptSitesApi(site);
    spec.detectChanges();
    await recordingPromise;
    spec.detectChanges();
    await sitePromise;
    spec.detectChanges();
  }

  it("should show id in table row", async () => {
    setup(new BehaviorSubject({}));
    await loadRows([defaultRecording], defaultSite);
    expect(getRowItem(0)).toContainText(defaultRecording.id.toString());
  });

  describe("site", () => {
    function getCell() {
      return getRowItem(1);
    }

    it("should show loading while site is unresolved", async () => {
      setup(new BehaviorSubject({}));
      const recordingPromise = interceptRecordingsApi([defaultRecording]);
      siteApi.show.and.callFake(() => new Subject());
      spec.detectChanges();
      await recordingPromise;
      spec.detectChanges();
      assertSpinner(getCell(), true);
    });

    it("should hide loading when site is resolved", async () => {
      setup(new BehaviorSubject({}));
      await loadRows([defaultRecording], defaultSite);
      assertSpinner(getCell(), false);
    });

    it("should show site name when resolved", async () => {
      setup(new BehaviorSubject({}));
      await loadRows([defaultRecording], defaultSite);
      expect(getCell()).toHaveText(defaultSite.name);
    });

    it("should link to site", async () => {
      setup(new BehaviorSubject({}));
      await loadRows([defaultRecording], defaultSite);
      expect(getCell().querySelector("a")).toHaveUrl(defaultSite.viewUrl);
    });
  });

  describe("recorded date", () => {
    function getCell() {
      return getRowItem(2).querySelector("span");
    }

    it("should show formatted date in table row", async () => {
      setup(new BehaviorSubject({}));
      const recording = new AudioRecording(
        generateAudioRecording({
          // UTC Time
          recordedDate: "2017-08-14T09:33:24.000Z",
          recordedDateTimezone: "Australia/Brisbane",
        }),
        injector
      );
      await loadRows([recording], defaultSite);
      // Brisbane time (+10:00)
      expect(getCell()).toContainText("2017-08-14 19:33:24");
    });
  });

  it("should show formatted duration in table row", async () => {
    setup(new BehaviorSubject({}));
    const recording = new AudioRecording(
      generateAudioRecording({ durationSeconds: 5580 }),
      injector
    );
    await loadRows([recording], defaultSite);
    expect(getRowItem(3)).toContainText("1 hour 33 minutes");
  });

  it("should show media type in table row", async () => {
    setup(new BehaviorSubject({}));
    await loadRows([defaultRecording], defaultSite);
    expect(getRowItem(4)).toContainText(defaultRecording.mediaType);
  });

  it("should show original file name in table row", async () => {
    setup(new BehaviorSubject({}));
    await loadRows([defaultRecording], defaultSite);
    expect(getRowItem(5)).toContainText(defaultRecording.originalFileName);
  });
});
