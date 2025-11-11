import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertChart } from "@test/helpers/charts";
import { SpeciesTimeSeriesComponent } from "./species-time-series.component";

describe("SpeciesTimeSeriesComponent", () => {
  let spec: Spectator<SpeciesTimeSeriesComponent>;

  const createComponent = createComponentFactory({
    component: SpeciesTimeSeriesComponent,
  });

  beforeEach(() => {
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

    spec = createComponent({
      props: {
        data: mockData,
        formatter: (tagId) => `Tag ${tagId.toString()}`,
      },
    });
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
      labels: [],
    },
    legend: {
      legendTitle: "Tags",
      legendLabels: [],
    },
  });
});
