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
import { TagFrequencyComponent } from "./tag-frequency.component";

describe("TagFrequencyComponent", () => {
  let spectator: Spectator<TagFrequencyComponent>;
  let tagShowSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: TagFrequencyComponent,
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
            tags: [
              { tagId: 1, events: 2 },
              { tagId: 2, events: 1 },
            ],
          }),
          new TagFrequencyReportItem({
            range: [
              DateTime.fromISO("2024-01-02T00:00:00.000Z"),
              DateTime.fromISO("2024-01-03T00:00:00.000Z"),
            ],
            tags: [
              { tagId: 1, events: 3 },
              { tagId: 2, events: 4 },
            ],
          }),
          new TagFrequencyReportItem({
            range: [
              DateTime.fromISO("2024-01-03T00:00:00.000Z"),
              DateTime.fromISO("2024-01-04T00:00:00.000Z"),
            ],
            tags: [
              { tagId: 1, events: 1 },
              { tagId: 2, events: 2 },
            ],
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
    expect(spectator.component).toBeInstanceOf(TagFrequencyComponent);
  });

  it("should render a line mark", () => {
    expectRenderedSvg(spectator);
    expectRenderedPaths(spectator);
  });

  it("should resolve the chart tags", () => {
    expect(tagShowSpy.calls.allArgs()).toEqual([[1], [2]]);
  });
});
