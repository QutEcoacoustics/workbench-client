import { Params } from "@angular/router";
import {
  AnnotationReportParameters,
  BucketSize,
  Chart,
} from "./AnnotationReportParameters";

describe("AnnotationReportParameters", () => {
  it("should create", () => {
    expect(new AnnotationReportParameters()).toBeInstanceOf(
      AnnotationReportParameters,
    );
  });

  it("should deserialize the current chart query parameters", () => {
    const queryParams: Params = {
      regions: "4,5",
      sites: "6,7",
      provenances: "8,9",
      tags: "10,11",
      score: "0.5",
      bucketSize: BucketSize.week,
      charts: [Chart.tagFrequencyStacked, Chart.tagBreakdown].join(","),
      dielBucketSize: "half-hour",
      daylightSavings: "true",
    };

    const model = new AnnotationReportParameters(queryParams);

    expect(model.regions).toEqual([4, 5]);
    expect(model.sites).toEqual([6, 7]);
    expect(model.provenances).toEqual([8, 9]);
    expect(model.tags).toEqual([10, 11]);
    expect(model.score).toBe(0.5);
    expect(model.bucketSize).toBe(BucketSize.week);
    expect(model.charts).toEqual([
      Chart.tagFrequencyStacked,
      Chart.tagBreakdown,
    ]);
    expect(model.dielBucketSize).toBe("half-hour");
    expect(model.daylightSavings).toBeTrue();
  });

  describe("toAudioEventFilter", () => {
    it("should use 'regions.id' as the filter key when regions are set", () => {
      const model = new AnnotationReportParameters();
      model.regions = [4, 5];

      const filter = model.toAudioEventFilter();

      expect(filter.filter).toEqual(
        jasmine.objectContaining({ "regions.id": jasmine.anything() }),
      );
      expect(filter.filter).not.toEqual(
        jasmine.objectContaining({ "region.id": jasmine.anything() }),
      );
    });

    it("should use 'sites.id' as the filter key when sites are set", () => {
      const model = new AnnotationReportParameters();
      model.sites = [6, 7];

      const filter = model.toAudioEventFilter();

      expect(filter.filter).toEqual(
        jasmine.objectContaining({ "sites.id": jasmine.anything() }),
      );
      expect(filter.filter).not.toEqual(
        jasmine.objectContaining({ "site.id": jasmine.anything() }),
      );
    });
  });

  it("should serialize the current chart query parameters", () => {
    const model = new AnnotationReportParameters();

    model.regions = [4, 5];
    model.sites = [6, 7];
    model.provenances = [8, 9];
    model.tags = [10, 11];
    model.score = 0.5;
    model.bucketSize = BucketSize.week;
    model.charts = [Chart.tagFrequencyStacked, Chart.tagBreakdown];
    model.dielBucketSize = "half-hour";
    model.daylightSavings = true;

    const queryParams = model.toQueryParams();

    expect(queryParams["regions"]).toBe("4,5");
    expect(queryParams["sites"]).toBe("6,7");
    expect(queryParams["provenances"]).toBe("8,9");
    expect(queryParams["tags"]).toBe("10,11");
    expect(queryParams["score"]).toBe("0.5");
    expect(queryParams["bucketSize"]).toBe(BucketSize.week);
    expect(queryParams["charts"]).toBe(
      [Chart.tagFrequencyStacked, Chart.tagBreakdown].join(","),
    );
    expect(queryParams["dielBucketSize"]).toBe("half-hour");
    expect(queryParams["daylightSavings"]).toBe("true");
  });
});
