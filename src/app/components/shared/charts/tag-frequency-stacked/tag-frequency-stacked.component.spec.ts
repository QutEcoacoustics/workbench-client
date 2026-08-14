import { TagsService } from "@baw-api/tag/tags.service";
import { TagFrequencyReportItem } from "@models/Reports";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import {
  expectRenderedPaths,
  expectRenderedSvg,
  resetSharedChartResizeObserver,
  stubElementWidth,
  stubSharedChartResizeObserver,
  waitForChartRender,
} from "@test/helpers/vega-chart";
import { DateTime } from "luxon";
import { of } from "rxjs";
import { TagFrequencyStackedComponent } from "./tag-frequency-stacked.component";

describe("TagFrequencyStackedComponent", () => {
  let spectator: Spectator<TagFrequencyStackedComponent>;
  let tagShowSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: TagFrequencyStackedComponent,
    providers: [
      {
        provide: TagsService,
        useValue: {
          show: (tagId: number) => tagShowSpy(tagId),
        },
      },
    ],
  });

  beforeEach(async () => {
    tagShowSpy = jasmine
      .createSpy("tagShow")
      .and.callFake((tagId: number) => of({ id: tagId, text: `Tag ${tagId}` }));
    stubSharedChartResizeObserver();

    spectator = createComponent({
      detectChanges: false,
      props: {
        rows: [
          new TagFrequencyReportItem({
            range: [
              DateTime.fromISO("2024-01-01T00:00:00.000Z"),
              DateTime.fromISO("2024-01-02T00:00:00.000Z"),
            ],
            tags: [{ tagId: 1, events: 2 }],
          }),
          new TagFrequencyReportItem({
            range: [
              DateTime.fromISO("2024-01-02T00:00:00.000Z"),
              DateTime.fromISO("2024-01-03T00:00:00.000Z"),
            ],
            tags: [{ tagId: 1, events: 3 }],
          }),
        ],
      },
    });

    stubElementWidth(spectator.element as HTMLElement, 640);

    await waitForChartRender(spectator);
  });

  afterEach(() => {
    spectator.fixture.destroy();
    resetSharedChartResizeObserver();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(TagFrequencyStackedComponent);
  });

  it("should render a line mark", () => {
    expectRenderedSvg(spectator);
    expectRenderedPaths(spectator);
  });

  it("should resolve the chart tags", () => {
    expect(tagShowSpy).toHaveBeenCalledOnceWith(1);
  });
});