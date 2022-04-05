import { Injector } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { toRelative } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { ISite, Site } from "@models/Site";
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import {
  DataTableBodyCellComponent,
  DatatableComponent,
} from "@swimlane/ngx-datatable";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateSite } from "@test/fakes/Site";
import { interceptShowApiRequest } from "@test/helpers/general";
import { assertUrl } from "@test/helpers/html";
import { ToastrService } from "ngx-toastr";
import { RecentAudioRecordingsComponent } from "./recent-audio-recordings.component";

describe("RecentAudioRecordingsComponent", () => {
  let api: SpyObject<ShallowSitesService>;
  let defaultRecording: AudioRecording;
  let injector: Injector;
  let spec: Spectator<RecentAudioRecordingsComponent>;
  const createComponent = createComponentFactory({
    component: RecentAudioRecordingsComponent,
    imports: [SharedModule, MockBawApiModule, RouterTestingModule],
    providers: [mockProvider(ToastrService)],
  });

  function interceptSiteRequest(
    data?: Errorable<Partial<ISite>>
  ): Promise<any> {
    const response = isBawApiError(data) ? data : generateSite(data);
    return interceptShowApiRequest(api, injector, response, Site);
  }

  function setRecordings(recordings: AudioRecording[]) {
    spec.setInput("audioRecordings", recordings);
  }

  async function setup(data?: {
    recordings?: AudioRecording[];
    awaitRequests?: boolean;
    site?: Errorable<Partial<ISite>>;
  }) {
    const promise = interceptSiteRequest(data?.site);
    setRecordings(data?.recordings ?? []);
    spec.detectChanges();

    if (data?.awaitRequests) {
      await promise;
      spec.detectChanges();
    }
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    injector = spec.inject(Injector);
    api = spec.inject(SHALLOW_SITE.token);
    defaultRecording = new AudioRecording(generateAudioRecording(), injector);
  });

  describe("table", () => {
    function getTable() {
      return spec.query(DatatableComponent);
    }

    it("should not have external paging", async () => {
      await setup();
      expect(getTable().externalPaging).toBeFalsy();
    });

    it("should not have external sorting", async () => {
      await setup();
      expect(getTable().externalSorting).toBeFalsy();
    });

    it("should not have footer", async () => {
      await setup();
      expect(getTable().footerHeight).toBe(0);
    });
  });

  describe("rows", () => {
    function getCells() {
      return spec.queryAll(DataTableBodyCellComponent);
    }

    function getCellElements() {
      return spec
        .queryAll("datatable-body-cell")
        .map((el) => el.firstElementChild);
    }

    function assertCellLoading(element: Element, loading: boolean) {
      const spinner = element.querySelector("baw-loading");
      if (loading) {
        expect(spinner).toBeTruthy();
      } else {
        expect(spinner).toBeFalsy();
      }
    }

    describe("site", () => {
      const getSiteCell = () => getCells()[0];
      const getSiteCellElement = () => getCellElements()[0];
      it("should display column", async () => {
        await setup({
          recordings: [defaultRecording],
          awaitRequests: true,
        });
        expect(getSiteCell().column.name).toBe("Site");
      });

      it("should display loading spinner while site unresolved", async () => {
        await setup({
          recordings: [defaultRecording],
        });
        assertCellLoading(getSiteCellElement(), true);
      });

      it("should not display loading spinner when site resolved", async () => {
        await setup({
          recordings: [defaultRecording],
          awaitRequests: true,
        });
        assertCellLoading(getSiteCellElement(), false);
      });

      it("should display site name when resolved", async () => {
        await setup({
          recordings: [defaultRecording],
          awaitRequests: true,
          site: { name: "Example Site" },
        });
        expect(getSiteCellElement()).toContainText("Example Site");
      });

      it("should display unknown site if unauthorized", async () => {
        await setup({
          recordings: [defaultRecording],
          awaitRequests: true,
          site: generateBawApiError(),
        });
        expect(getSiteCellElement()).toContainText("Unknown Site");
      });
    });

    describe("duration", () => {
      const getUpdatedCellElement = () => getCellElements()[1];

      function assertTimestamp(cell: Element, recording: AudioRecording) {
        expect(cell).toContainText(toRelative(recording.duration));
      }

      it("should display time since updated", async () => {
        await setup({ recordings: [defaultRecording] });
        assertTimestamp(getUpdatedCellElement(), defaultRecording);
      });
    });

    describe("uploaded", () => {
      const getUpdatedCellElement = () => getCellElements()[2];

      function assertTimestamp(cell: Element, recording: AudioRecording) {
        expect(cell).toContainText(recording.recordedDate.toRelative());
      }

      it("should display time since updated", async () => {
        await setup({ recordings: [defaultRecording] });
        assertTimestamp(getUpdatedCellElement(), defaultRecording);
      });
    });

    describe("actions", () => {
      const getActionCellElement = () => getCellElements()[3];
      const getPlayButton = () =>
        getActionCellElement().querySelector<HTMLAnchorElement>("#playBtn");

      it("should link to listen page", async () => {
        await setup({ recordings: [defaultRecording] });
        assertUrl(getPlayButton(), { bawUrl: defaultRecording.viewUrl });
      });
    });
  });
});
