import { Spectator, createComponentFactory } from "@ngneat/spectator";
import { ToastService } from "@services/toasts/toasts.service";
import { Data } from "vega-lite/build/src/data";
import { Map } from "immutable";
import { fakeAsync } from "@angular/core/testing";
import { Datasets } from "vega-lite/build/src/spec/toplevel";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ChartComponent } from "./chart.component";

//! this component could not be tested with print styles. Manually test this
// component with print styles when making changes
describe("ChartComponent", () => {
  let spectator: Spectator<ChartComponent>;
  let windowSpy: jasmine.Spy;
  let resizeObserveSpy: jasmine.Spy;
  let resizeUnobserveSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: ChartComponent,
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  function setup(
    defaultSpec: Map<string, object>,
    defaultData?: Data,
    defaultDataset?: Datasets
  ): void {
    spectator = createComponent({ detectChanges: false });

    spectator.setInput({
      spec: defaultSpec,
      data: defaultData,
      datasets: defaultDataset,
    });

    // we spy on the DOM's window element so that we can test for resize events
    windowSpy = spyOn(window, "dispatchEvent");
    resizeObserveSpy = spyOn(ResizeObserver.prototype, "observe").and.callThrough();
    resizeUnobserveSpy = spyOn(ResizeObserver.prototype, "unobserve").and.callThrough();

    spectator.detectChanges();
  }

  // valid data and valid spec can be used as test data when data and spec are not important to the test
  const validSpec: Map<string, any> = Map({
    width: "container",
    height: 50,
    mark: "bar",
    encoding: {
      x: {
        field: "startDate",
        type: "temporal",
        timeUnit: "yearmonthdate",
      },
      x2: {
        field: "endDate",
      },
    },
  });

  const validData: Data = [
    { startDate: "10-10-2020", endDate: "11-10-2020" },
    { startDate: "16-10-2020", endDate: "28-10-2020" },
    { startDate: "01-11-2020", endDate: "12-12-2020" },
  ];

  const chartElement = (): HTMLDivElement =>
    spectator.query<HTMLDivElement>(".chartContainer");
  const chartSvg = (): SVGElement =>
    chartElement().querySelector<SVGElement>("svg");

  beforeEach(fakeAsync(() => setup(validSpec, validData)));

  afterEach(() => {
    // if we don't explicitly destroy the test bed after tests, the resize observer will continue to observe the component
    // this will cause all tests to fail if one test fails that depends on the resize observer
    // to ensure only one test fails if the resize observer is not working, we explicitly destroy the test bed after each test
    spectator.fixture.destroy();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(ChartComponent);
  });

  it("should use svg to render the chart", () => {
    expect(chartSvg()).toExist();
  });

  it("should fire a resize event when the component is initially loaded", () => {
    expect(windowSpy).toHaveBeenCalledWith(new Event("resize"));
  });

  it("should have an attached resize observer", () => {
    expect(resizeObserveSpy).toHaveBeenCalledWith(chartElement());
  });

  // assert that the resize observer was disassociated with the component when it was destroyed
  it("should destroy the chart component correctly", () => {
    spectator.fixture.destroy();
    expect(resizeUnobserveSpy).toHaveBeenCalledWith(chartElement());
  });
});
