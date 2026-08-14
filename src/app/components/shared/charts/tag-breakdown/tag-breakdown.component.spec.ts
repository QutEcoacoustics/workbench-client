import { TagsService } from "@baw-api/tag/tags.service";
import {
  TagDielActivityReportItem,
  TagFrequencyReportItem,
} from "@models/Reports";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import {
  expectRenderedPaths,
  expectRenderedSvg,
  resetSharedChartResizeObserver,
  stubSharedChartResizeObserver,
  waitForChartRender,
} from "@test/helpers/vega-chart";
import { DateTime } from "luxon";
import { of } from "rxjs";
import { TagBreakdownComponent } from "./tag-breakdown.component";

describe("TagBreakdownComponent", () => {
  let spectator: Spectator<TagBreakdownComponent>;
  let tagShowSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: TagBreakdownComponent,
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
      props: {
        frequencyRows: [
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
        dielRows: [
          new TagDielActivityReportItem({
            range: [0, 3600],
            tags: [{ tagId: 1, events: 1 }],
          }),
          new TagDielActivityReportItem({
            range: [3600, 7200],
            tags: [{ tagId: 1, events: 4 }],
          }),
          new TagDielActivityReportItem({
            range: [7200, 10800],
            tags: [{ tagId: 1, events: 2 }],
          }),
        ],
      },
    });

    await waitForChartRender(spectator);
  });

  afterEach(() => {
    spectator.fixture.destroy();
    resetSharedChartResizeObserver();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(TagBreakdownComponent);
  });

  it("should render the two breakdown charts", () => {
    expectRenderedSvg(spectator, 2);
    expectRenderedPaths(spectator, 2);
  });

  it("should resolve the chart tags", () => {
    expect(tagShowSpy).toHaveBeenCalledOnceWith(1);
  });
});