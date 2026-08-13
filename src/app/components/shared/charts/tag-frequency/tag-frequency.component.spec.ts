import { TagsService } from "@baw-api/tag/tags.service";
import { TagFrequencyReportItem } from "@models/Reports";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ChartComponent } from "@shared/chart/chart.component";
import { assertChart } from "@test/helpers/charts";
import { DateTime } from "luxon";
import { concat, NEVER, of } from "rxjs";
import {
  flattenFrequencyRows,
  TagFrequencyComponent,
} from "./tag-frequency.component";

describe("flattenFrequencyRows", () => {
  it("should emit zero events for tags absent from a range", () => {
    const ranges: TagFrequencyReportItem["range"][] = [
      [DateTime.fromISO("2024-01-01"), DateTime.fromISO("2024-01-02")],
      [DateTime.fromISO("2024-01-02"), DateTime.fromISO("2024-01-03")],
      [DateTime.fromISO("2024-01-03"), DateTime.fromISO("2024-01-04")],
    ];
    const rows = [
      { range: ranges[0], tags: [{ tagId: 1, events: 4 }] },
      { range: ranges[1], tags: [] },
      { range: ranges[2], tags: [{ tagId: 2, events: 3 }] },
    ] as TagFrequencyReportItem[];

    expect(flattenFrequencyRows(rows)).toEqual([
      { range: ranges[0], tagId: 1, events: 4 },
      { range: ranges[0], tagId: 2, events: 0 },
      { range: ranges[1], tagId: 1, events: 0 },
      { range: ranges[1], tagId: 2, events: 0 },
      { range: ranges[2], tagId: 1, events: 0 },
      { range: ranges[2], tagId: 2, events: 3 },
    ]);
  });
});

describe("SpeciesTimeSeriesComponent", () => {
  let spec: Spectator<SpeciesTimeSeriesComponent>;
  let tagShowSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: SpeciesTimeSeriesComponent,
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
    tagShowSpy = jasmine.createSpy("tagShow").and.callFake((tagId: number) =>
      concat(
        of({
          id: tagId,
          text: `Tag ${tagId}`,
        }),
        NEVER,
      ),
    );
    const range = (
      start: string,
      end: string,
    ): TagFrequencyReportItem["range"] => [
      DateTime.fromISO(start),
      DateTime.fromISO(end),
    ];
    const mockRows: TagFrequencyReportItem[] = [
      new TagFrequencyReportItem({
        range: range("2023-05-22", "2023-05-23"),
        tags: [
          { tagId: 1, events: 55 },
          { tagId: 39, events: 30 },
          { tagId: 277, events: 15 },
        ],
      }),
      new TagFrequencyReportItem({
        range: range("2023-05-23", "2023-05-24"),
        tags: [
          { tagId: 1, events: 45 },
          { tagId: 39, events: 20 },
          { tagId: 277, events: 35 },
        ],
      }),
      new TagFrequencyReportItem({
        range: range("2023-05-24", "2023-05-25"),
        tags: [
          { tagId: 1, events: 5 },
          { tagId: 39, events: 25 },
          { tagId: 277, events: 70 },
        ],
      }),
      new TagFrequencyReportItem({
        range: range("2023-05-25", "2023-05-26"),
        tags: [
          { tagId: 1, events: 50 },
          { tagId: 39, events: 20 },
          { tagId: 277, events: 30 },
        ],
      }),
      new TagFrequencyReportItem({
        range: range("2023-05-26", "2023-05-27"),
        tags: [
          { tagId: 1, events: 25 },
          { tagId: 39, events: 40 },
          { tagId: 277, events: 35 },
        ],
      }),
      new TagFrequencyReportItem({
        range: range("2023-05-27", "2023-05-28"),
        tags: [
          { tagId: 1, events: 15 },
          { tagId: 39, events: 30 },
          { tagId: 277, events: 55 },
        ],
      }),
      new TagFrequencyReportItem({
        range: range("2023-05-28", "2023-05-29"),
        tags: [
          { tagId: 1, events: 10 },
          { tagId: 39, events: 20 },
          { tagId: 277, events: 70 },
        ],
      }),
      new TagFrequencyReportItem({
        range: range("2023-05-29", "2023-05-30"),
        tags: [
          { tagId: 1, events: 5 },
          { tagId: 39, events: 15 },
          { tagId: 277, events: 80 },
        ],
      }),
      new TagFrequencyReportItem({
        range: range("2023-05-30", "2023-05-31"),
        tags: [
          { tagId: 1, events: 5 },
          { tagId: 39, events: 10 },
          { tagId: 277, events: 85 },
        ],
      }),
    ];

    // Mock the chart components resize observer because otherwise the tests
    // will become flaky due to the ResizeObserver events not completing before
    // the test assertions run.
    // Because these tests assert over data and not layout, we do not need to
    // test the resize behavior.
    ChartComponent.resizeObserver = jasmine.createSpyObj("ResizeObserver", [
      "observe",
      "unobserve",
      "disconnect",
    ]);

    spec = createComponent({
      props: {
        rows: mockRows,
      },
    });

    await spec.fixture.whenStable();
  });

  afterEach(() => {
    // if we don't explicitly destroy the test bed after tests, the resize observer will continue to observe the component
    // this will cause all tests to fail if one test fails that depends on the resize observer
    // to ensure only one test fails if the resize observer is not working, we explicitly destroy the test bed after each test
    spec.fixture.destroy();

    // reset the ChartComponent resize observer mock to avoid side effects on
    // other tests
    ChartComponent.resizeObserver = undefined;
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(TagFrequencyComponent);
  });

  it("should resolve each distinct tag", () => {
    expect(tagShowSpy.calls.allArgs()).toEqual([[1], [39], [277]]);
  });

  assertChart(() => spec, {
    xAxis: {
      title: "Date",
      labels: [
        "2023-05-22",
        "2023-05-23",
        "2023-05-24",
        "2023-05-25",
        "2023-05-26",
        "2023-05-27",
        "2023-05-28",
        "2023-05-29",
        "2023-05-30",
      ],
    },
    yAxis: {
      title: "Count of Events",
      labels: ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90"],
    },
    legend: {
      legendTitle: "Tags",
      legendLabels: ["Tag 1", "Tag 39", "Tag 277"],
    },
  });
});
