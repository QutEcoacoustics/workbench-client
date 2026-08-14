import { TagAccumulationItem } from "@models/Reports";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import {
  expectRenderedPaths,
  expectRenderedSvg,
  resetSharedChartResizeObserver,
  stubSharedChartResizeObserver,
  waitForChartRender,
} from "@test/helpers/vega-chart";
import { DateTime } from "luxon";
import { TagAccumulationComponent } from "./tag-accumulation.component";

describe("TagAccumulationComponent", () => {
  let spectator: Spectator<TagAccumulationComponent>;

  const createComponent = createComponentFactory({
    component: TagAccumulationComponent,
  });

  beforeEach(async () => {
    stubSharedChartResizeObserver();

    spectator = createComponent({
      props: {
        rows: [
          new TagAccumulationItem({
            range: [
              DateTime.fromISO("2024-01-01T00:00:00.000Z"),
              DateTime.fromISO("2024-01-02T00:00:00.000Z"),
            ],
            cumulativeUniqueTagCount: 1,
          }),
          new TagAccumulationItem({
            range: [
              DateTime.fromISO("2024-01-02T00:00:00.000Z"),
              DateTime.fromISO("2024-01-03T00:00:00.000Z"),
            ],
            cumulativeUniqueTagCount: 2,
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
    expect(spectator.component).toBeInstanceOf(TagAccumulationComponent);
  });

  it("should render a line mark", () => {
    expectRenderedSvg(spectator);
    expectRenderedPaths(spectator);
  });
});