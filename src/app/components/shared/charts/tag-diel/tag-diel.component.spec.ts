import { TagsService } from "@baw-api/tag/tags.service";
import { TagDielActivityReportItem } from "@models/Reports";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import {
  expectRenderedPaths,
  expectRenderedSvg,
  resetSharedChartResizeObserver,
  stubSharedChartResizeObserver,
  waitForChartRender,
} from "@test/helpers/vega-chart";
import { of } from "rxjs";
import { TagDielComponent } from "./tag-diel.component";

describe("TagDielComponent", () => {
  let spectator: Spectator<TagDielComponent>;
  let tagShowSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: TagDielComponent,
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
        rows: [
          new TagDielActivityReportItem({
            range: [0, 3600],
            tags: [{ tagId: 1, events: 2 }],
          }),
          new TagDielActivityReportItem({
            range: [3600, 7200],
            tags: [{ tagId: 1, events: 3 }],
          }),
          new TagDielActivityReportItem({
            range: [7200, 10800],
            tags: [{ tagId: 1, events: 1 }],
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
    expect(spectator.component).toBeInstanceOf(TagDielComponent);
  });

  it("should render a line mark", () => {
    expectRenderedSvg(spectator);
    expectRenderedPaths(spectator);
  });

  it("should resolve the chart tags", () => {
    expect(tagShowSpy).toHaveBeenCalledOnceWith(1);
  });
});