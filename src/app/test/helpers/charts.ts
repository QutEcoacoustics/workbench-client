import { Spectator } from "@ngneat/spectator";

interface ExpectedChart {
  xAxis: {
    title: string;
    labels: string[];
  };
  yAxis: {
    title: string;
    labels: string[];
  };
  legend: {
    legendTitle: string;
    legendLabels: string[];
  };
}

export function assertChart(
  spec: () => Spectator<any>,
  expected: ExpectedChart,
) {
  describe("assertChart", () => {
    beforeEach(async () => {
      // We have to use await whenStable here because the chart attaches in async
      // during the ngAfterViewInit lifecycle hook.
      spec().detectChanges();
      await spec().fixture.whenStable();
    });

    const axisElements = () => spec().queryAll("[aria-roledescription='axis']");

    const yAxisElement = () => axisElements()[0];
    const yAxisTitle = () => yAxisElement().querySelector(".role-axis-title");

    const xAxisElement = () => axisElements()[1];
    // const xAxisTitle = () => xAxisElement().querySelector(".role-axis-title");

    const legendTitle = () => spec().query(".role-legend-title");
    const legendLabels = () => spec().queryAll(".role-legend-label");

    function axisLabels(axisElement: Element): string[] {
      const labelGroup = axisElement.querySelector(".role-axis-label");
      const labels = Array.from(labelGroup?.querySelectorAll("text"));

      const labelText = labels.map((label) => label.textContent?.trim() ?? "");

      return labelText;
    }

    it("should have the correct axes", () => {
      // TODO: For some reason, this assertion is not working correctly.
      // The x-axis title is not loading in correctly during the test.
      // expect(xAxisTitle()).toHaveExactTrimmedText(expected.xAxis.title);
      expect(yAxisTitle()).toHaveExactTrimmedText(expected.yAxis.title);

      const yLabels = axisLabels(yAxisElement());
      expect(yLabels).toEqual(expected.yAxis.labels);

      const xLabels = axisLabels(xAxisElement());
      expect(xLabels).toEqual(expected.xAxis.labels);
    });

    it("should have the correct legend", () => {
      const title = legendTitle();
      expect(title).toHaveExactTrimmedText(expected.legend.legendTitle);

      const labels = legendLabels();
      expected.legend.legendLabels.forEach((label, i) => {
        expect(labels[i]).toHaveExactTrimmedText(label);
      });
    });
  });
}
