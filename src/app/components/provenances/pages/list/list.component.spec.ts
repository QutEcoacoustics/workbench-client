import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import {
  IAudioEventProvenance,
  AudioEventProvenance,
} from "@models/AudioEventProvenance";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { CardsComponent } from "@shared/model-cards/cards/cards.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { nStepObservable } from "@test/helpers/general";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { Subject } from "rxjs";
import { MockComponent } from "ng-mocks";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { ProvenanceListComponent } from "./list.component";

describe("ProvenanceListComponent", () => {
  let api: SpyObject<AudioEventProvenanceService>;
  let spec: Spectator<ProvenanceListComponent>;

  const createComponent = createRoutingFactory({
    component: ProvenanceListComponent,
    imports: [MockComponent(CardsComponent)],
    providers: [provideMockBawApi()],
  });

  function generateProvenances(
    numProvenances: number,
    overrides: IAudioEventProvenance = {}
  ): AudioEventProvenance[] {
    const provenances = [];
    for (let i = 0; i < Math.min(numProvenances, defaultApiPageSize); i++) {
      const provenance = new AudioEventProvenance(
        generateAudioEventProvenance(overrides)
      );
      provenance.addMetadata({
        status: 200,
        message: "OK",
        paging: { total: numProvenances },
      });
      provenances.push(provenance);
    }
    return provenances;
  }

  async function handleApiRequest(
    models: Errorable<AudioEventProvenance[]>,
    assertFilter: (filters: Filters<AudioEventProvenance>) => void = () => {}
  ) {
    const subject = new Subject<AudioEventProvenance[]>();
    const promise = nStepObservable(
      subject,
      () => models,
      isBawApiError(models)
    );
    api.filter.and.callFake((filters) => {
      assertFilter(filters);
      return subject;
    });

    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

  function getCardsComponent() {
    return spec.query(CardsComponent);
  }

  function getCards() {
    return getCardsComponent()?.models;
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(AudioEventProvenanceService);
  });

  assertPageInfo(ProvenanceListComponent, ["Provenances"]);

  it("should initially request page 1", async () => {
    await handleApiRequest([], (filter) => expect(filter.paging.page).toBe(1));
  });

  it("should handle failed provenances model", async () => {
    await handleApiRequest(generateBawApiError());
    assertErrorHandler(spec.fixture, true);
  });

  describe("provenances", () => {
    function assertCard(index: number, model: AudioEventProvenance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getCards().get(index)).toBe(model as any);
    }

    it("should handle zero provenances", async () => {
      await handleApiRequest([]);
      const title = spec.query<HTMLHeadingElement>("h4");
      expect(title).toContainText("Your list of provenances is empty");
      expect(getCardsComponent()).toBeFalsy();
    });

    it("should display single provenance card", async () => {
      await handleApiRequest(generateProvenances(1));
      expect(getCards().size).toBe(1);
    });

    it("should display single provenance card", async () => {
      const provenances = generateProvenances(1);
      await handleApiRequest(provenances);
      assertCard(0, provenances[0]);
    });

    it("should display multiple provenance cards", async () => {
      const provenances = generateProvenances(3);
      await handleApiRequest(provenances);
      expect(getCards().size).toBe(3);
    });

    it("should display multiple provenance cards in order", async () => {
      const provenances = generateProvenances(3);
      await handleApiRequest(provenances);
      provenances.forEach((provenance, index) => assertCard(index, provenance));
    });
  });

  describe("scrolling", () => {
    function getPagination() {
      return spec.query(NgbPagination);
    }

    function getPaginationLinks() {
      return spec.queryAll("ngb-pagination a");
    }

    it("should hide pagination if less than one page of models", async () => {
      const provenances = generateProvenances(5);
      await handleApiRequest(provenances);
      expect(getPagination()).toBeFalsy();
    });

    it("should display pagination if more than one page of models", async () => {
      const provenances = generateProvenances(defaultApiPageSize * 2);
      await handleApiRequest(provenances);
      expect(getPagination()).toBeTruthy();
    });

    it("should display correct number of pages", async () => {
      const provenances = generateProvenances(defaultApiPageSize * 3);
      await handleApiRequest(provenances);
      // 3 Pages, 2 additional options to select forwards and back
      expect(getPaginationLinks().length).toBe(3 + 2);
    });
  });

  describe("filtering", () => {
    function getFilterInput(): HTMLInputElement {
      return spec.query("input[type='text']");
    }

    function getInputDirective() {
      return spec.query(DebouncedInputDirective);
    }

    it("should have filtering option", async () => {
      const provenances = generateProvenances(3);
      await handleApiRequest(provenances);
      expect(getFilterInput()).toBeTruthy();
    });

    it("should have default value attached", async () => {
      const provenances = generateProvenances(3);
      await handleApiRequest(provenances);
      spec.component.filter = "custom value";
      spec.detectChanges();
      expect(getFilterInput()["value"]).toBe("custom value");
    });

    it("should call onFilter when event detected", async () => {
      const provenances = generateProvenances(3);
      await handleApiRequest(provenances);
      spyOn(spec.component, "onFilter").and.stub();
      getInputDirective().valueChange.emit("custom value");
      expect(spec.component.onFilter).toHaveBeenCalled();
    });
  });
});
