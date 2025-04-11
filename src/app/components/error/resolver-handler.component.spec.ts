import { RouterTestingModule } from "@angular/router/testing";
import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { IPageInfo } from "@helpers/page/pageInfo";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generatePageInfoResolvers } from "@test/helpers/general";
import { NOT_FOUND, UNAUTHORIZED } from "http-status";
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

  function assertErrorHandler(error?: BawApiError) {
    const handler = spec.query(ErrorHandlerComponent);

    if (!error) {
      expect(handler).toBeFalsy();
    } else {
      expect(handler.error).toEqual(error);
    }
  }

  describe("handleResolvers", () => {
    it("should handle undefined resolvers", () => {
      setup({ resolvers: undefined });
      spec.detectChanges();
      assertErrorHandler();
    });

    it("should not display if single passing resolver", () => {
      setup(generatePageInfoResolvers({ model: new MockModel({}) }));
      spec.detectChanges();
      assertErrorHandler();
    });

    it("should not display if multiple passing resolvers", () => {
      setup(
        generatePageInfoResolvers(
          { model: new MockModel({}) },
          { model: new MockModel({}) },
          { model: new MockModel({}) }
        )
      );
      spec.detectChanges();
      assertErrorHandler();
    });

    it("should display error if single failing resolver", () => {
      const error = generateBawApiError();
      setup(generatePageInfoResolvers({ error }));
      spec.detectChanges();
      assertErrorHandler(error);
    });

    it("should display error if multiple failing resolvers", () => {
      const error = generateBawApiError();
      setup(generatePageInfoResolvers({ error }, { error }, { error }));
      spec.detectChanges();
      assertErrorHandler(error);
    });

    it("should prioritize unauthorized error if multiple failing resolvers", () => {
      const unauthorized = generateBawApiError(UNAUTHORIZED);
      const notFound = generateBawApiError(NOT_FOUND);
      setup(
        generatePageInfoResolvers(
          { error: notFound },
          { error: unauthorized },
          { error: notFound }
        )
      );
      spec.detectChanges();
      assertErrorHandler(unauthorized);
    });

    it("should display error if mixed passing and failing resolvers", () => {
      const error = generateBawApiError();
      setup(
        generatePageInfoResolvers(
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
      setup(generatePageInfoResolvers({ error: generateBawApiError() }));
      spec.detectChanges();
      spec.triggerNavigation({
        data: generatePageInfoResolvers({ model: new MockModel({}) }),
      });
      spec.detectChanges();
      assertErrorHandler();
    });

    it("should display error if new route data contains resolver failure", () => {
      const error = generateBawApiError();
      setup(generatePageInfoResolvers({ model: new MockModel({}) }));
      spec.detectChanges();
      spec.triggerNavigation({ data: generatePageInfoResolvers({ error }) });
      spec.detectChanges();
      assertErrorHandler(error);
    });
  });
});
