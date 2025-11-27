import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ChartComponent } from "@shared/chart/chart.component";
import { assertChart } from "@test/helpers/charts";
import {
  SpeciesCompositionGraphComponent,
  SpeciesCompositionGraphData,
} from "./species-composition.component";

describe("SpeciesCompositionGraphComponent", () => {
  let spec: Spectator<SpeciesCompositionGraphComponent>;

  const createComponent = createComponentFactory({
    component: SpeciesCompositionGraphComponent,
  });

  beforeEach(async () => {
    // TODO: Make this work with pseudo-random data generation
    const mockData: SpeciesCompositionGraphData[] = [
      { date: "2023-05-22", tagId: 1, ratio: 0.55 },
      { date: "2023-05-22", tagId: 39, ratio: 0.3 },
      { date: "2023-05-22", tagId: 277, ratio: 0.15 },
      { date: "2023-05-23", tagId: 1, ratio: 0.45 },
      { date: "2023-05-23", tagId: 39, ratio: 0.2 },
      { date: "2023-05-23", tagId: 277, ratio: 0.35 },
      { date: "2023-05-24", tagId: 1, ratio: 0.05 },
      { date: "2023-05-24", tagId: 39, ratio: 0.25 },
      { date: "2023-05-24", tagId: 277, ratio: 0.7 },
      { date: "2023-05-25", tagId: 1, ratio: 0.5 },
      { date: "2023-05-25", tagId: 39, ratio: 0.2 },
      { date: "2023-05-25", tagId: 277, ratio: 0.3 },
      { date: "2023-05-26", tagId: 1, ratio: 0.25 },
      { date: "2023-05-26", tagId: 39, ratio: 0.4 },
      { date: "2023-05-26", tagId: 277, ratio: 0.35 },
      { date: "2023-05-27", tagId: 1, ratio: 0.15 },
      { date: "2023-05-27", tagId: 39, ratio: 0.3 },
      { date: "2023-05-27", tagId: 277, ratio: 0.55 },
      { date: "2023-05-28", tagId: 1, ratio: 0.1 },
      { date: "2023-05-28", tagId: 39, ratio: 0.2 },
      { date: "2023-05-28", tagId: 277, ratio: 0.7 },
      { date: "2023-05-29", tagId: 1, ratio: 0.05 },
      { date: "2023-05-29", tagId: 39, ratio: 0.15 },
      { date: "2023-05-29", tagId: 277, ratio: 0.8 },
      { date: "2023-05-30", tagId: 1, ratio: 0.05 },
      { date: "2023-05-30", tagId: 39, ratio: 0.1 },
      { date: "2023-05-30", tagId: 277, ratio: 0.85 },
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
    expect(spec.component).toBeInstanceOf(SpeciesCompositionGraphComponent);
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
      title: "Ratio of Tags",
      labels: [
        "0.0",
        "0.1",
        "0.2",
        "0.3",
        "0.4",
        "0.5",
        "0.6",
        "0.7",
        "0.8",
        "0.9",
        "1.0",
      ],
    },
    legend: {
      legendTitle: "Tags",
      legendLabels: ["Tag 1", "Tag 39", "Tag 277"],
    },
  });
});
