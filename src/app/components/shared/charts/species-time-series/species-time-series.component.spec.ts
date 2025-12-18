import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ChartComponent } from "@shared/chart/chart.component";
import { assertChart } from "@test/helpers/charts";
import { SpeciesTimeSeriesComponent } from "./species-time-series.component";

describe("SpeciesTimeSeriesComponent", () => {
  let spec: Spectator<SpeciesTimeSeriesComponent>;

  const createComponent = createComponentFactory({
    component: SpeciesTimeSeriesComponent,
  });

  beforeEach(async () => {
    const mockData = [
      { date: "2023-05-22", tagId: 1, count: 55 },
      { date: "2023-05-22", tagId: 39, count: 30 },
      { date: "2023-05-22", tagId: 277, count: 15 },
      { date: "2023-05-23", tagId: 1, count: 45 },
      { date: "2023-05-23", tagId: 39, count: 20 },
      { date: "2023-05-23", tagId: 277, count: 35 },
      { date: "2023-05-24", tagId: 1, count: 5 },
      { date: "2023-05-24", tagId: 39, count: 25 },
      { date: "2023-05-24", tagId: 277, count: 70 },
      { date: "2023-05-25", tagId: 1, count: 50 },
      { date: "2023-05-25", tagId: 39, count: 20 },
      { date: "2023-05-25", tagId: 277, count: 30 },
      { date: "2023-05-26", tagId: 1, count: 25 },
      { date: "2023-05-26", tagId: 39, count: 40 },
      { date: "2023-05-26", tagId: 277, count: 35 },
      { date: "2023-05-27", tagId: 1, count: 15 },
      { date: "2023-05-27", tagId: 39, count: 30 },
      { date: "2023-05-27", tagId: 277, count: 55 },
      { date: "2023-05-28", tagId: 1, count: 10 },
      { date: "2023-05-28", tagId: 39, count: 20 },
      { date: "2023-05-28", tagId: 277, count: 70 },
      { date: "2023-05-29", tagId: 1, count: 5 },
      { date: "2023-05-29", tagId: 39, count: 15 },
      { date: "2023-05-29", tagId: 277, count: 80 },
      { date: "2023-05-30", tagId: 1, count: 5 },
      { date: "2023-05-30", tagId: 39, count: 10 },
      { date: "2023-05-30", tagId: 277, count: 85 },
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
        data: mockData,
        formatter: (tagId) => `Tag ${tagId.toString()}`,
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
    expect(spec.component).toBeInstanceOf(SpeciesTimeSeriesComponent);
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
      labels: [
        "0",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
      ],
    },
    legend: {
      legendTitle: "Tags",
      legendLabels: ["Tag 1", "Tag 39", "Tag 277"],
    },
  });
});
