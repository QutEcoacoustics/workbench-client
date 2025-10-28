import { ActivatedRouteSnapshot } from "@angular/router";
import { modelData } from "@test/helpers/faker";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { AnnotationMapParametersResolver } from "./annotation-map-parameters.resolver";

describe("AnnotationMapParametersResolver", () => {
  let spec: SpectatorService<AnnotationMapParametersResolver>;

  const createResolver = createServiceFactory({
    service: AnnotationMapParametersResolver,
  });

  beforeEach(() => {
    spec = createResolver();
  });

  it("should return an AnnotationMapParameters model", async () => {
    const focused = modelData.id();
    const mockRoute: ActivatedRouteSnapshot = {
      queryParams: {
        focused: `${focused}`,
      },
    } as any;

    const result = await spec.service.resolve(mockRoute);

    expect(result.model.focused).toEqual(focused);
    expect(result.model.toFilter()).toEqual({});
    expect(result.model.toQueryParams()).toEqual({ focused });
  });
});
