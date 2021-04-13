import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { IPageInfo } from "@helpers/page/pageInfo";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { MockComponent } from "ng-mocks";
import { ResolverHandlerComponent } from "./resolver-handler.component";

const mockErrorHandler = MockComponent(ErrorHandlerComponent);

describe("ResolverHandlerComponent", () => {
  let spec: SpectatorRouting<ResolverHandlerComponent>;
  const createComponent = createRoutingFactory({
    component: ResolverHandlerComponent,
    declarations: [mockErrorHandler],
    imports: [RouterTestingModule],
  });

  function setup(data: Partial<IPageInfo>) {
    spec = createComponent({ detectChanges: false, data });
  }

  function assertErrorHandler(error?: ApiErrorDetails) {
    const handler = spec.query(mockErrorHandler);

    if (!error) {
      expect(handler).toBeFalsy();
    } else {
      expect(handler.error).toEqual(error);
    }
  }

  function generateData(...models: ResolvedModel[]): Partial<IPageInfo> {
    const data: Partial<IPageInfo> = { resolvers: {} };

    models.forEach((model, index) => {
      const key = "model" + index;
      data.resolvers[key] = "resolver";
      data[key] = model;
    });

    return data;
  }

  describe("handleResolvers", () => {
    it("should handle undefined resolvers", () => {
      setup({ resolvers: undefined });
      spec.detectChanges();
      assertErrorHandler();
    });

    it("should not display if single passing resolver", () => {
      setup(generateData({ model: new MockModel({}) }));
      spec.detectChanges();
      assertErrorHandler();
    });

    it("should not display if multiple passing resolvers", () => {
      setup(
        generateData(
          { model: new MockModel({}) },
          { model: new MockModel({}) },
          { model: new MockModel({}) }
        )
      );
      spec.detectChanges();
      assertErrorHandler();
    });

    it("should display error if single failing resolver", () => {
      const error = generateApiErrorDetails();
      setup(generateData({ error }));
      spec.detectChanges();
      assertErrorHandler(error);
    });

    it("should display error if multiple failing resolvers", () => {
      const error = generateApiErrorDetails();
      setup(generateData({ error }, { error }, { error }));
      spec.detectChanges();
      assertErrorHandler(error);
    });

    it("should prioritize unauthorized error if multiple failing resolvers", () => {
      const unauthorized = generateApiErrorDetails("Unauthorized");
      const notFound = generateApiErrorDetails("Not Found");
      setup(
        generateData(
          { error: notFound },
          { error: unauthorized },
          { error: notFound }
        )
      );
      spec.detectChanges();
      assertErrorHandler(unauthorized);
    });

    it("should display error if mixed passing and failing resolvers", () => {
      const error = generateApiErrorDetails();
      setup(
        generateData(
          { model: new MockModel({}) },
          { error },
          { model: new MockModel({}) }
        )
      );
      spec.detectChanges();
      assertErrorHandler(error);
    });
  });

  describe("route data", () => {
    it("should clear error if new route data does not contain resolver failure", () => {
      setup(generateData({ error: generateApiErrorDetails() }));
      spec.detectChanges();
      spec.triggerNavigation({
        data: generateData({ model: new MockModel({}) }),
      });
      spec.detectChanges();
      assertErrorHandler();
    });

    it("should display error if new route data contains resolver failure", () => {
      const error = generateApiErrorDetails();
      setup(generateData({ model: new MockModel({}) }));
      spec.detectChanges();
      spec.triggerNavigation({ data: generateData({ error }) });
      spec.detectChanges();
      assertErrorHandler(error);
    });
  });
});
