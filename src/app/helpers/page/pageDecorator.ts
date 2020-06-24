import { Type } from "@angular/core";
import { PageComponentInterface, PageComponentStatic } from "./pageComponent";
import { PageInfo, PageInfoInterface } from "./pageInfo";

/**
 * Type alias for a component's constructor that will produce
 * a new component that implements the `PageComponentInterface`
 * interface.
 */
export type DecoratedPageComponent = Type<PageComponentInterface> &
  PageComponentStatic;

/**
 * Page info decorator. Annotate an component class with this
 * declaration to attach page info to the component.
 * @param info the configuration for the `Page`.
 */
export function Page(
  info: PageInfoInterface
): (constructor: Type<any>) => DecoratedPageComponent {
  // tslint:disable-next-line: only-arrow-functions
  return function PageDecorator(
    componentConstructor: Type<PageComponentInterface>
  ): DecoratedPageComponent {
    const staticInfo = new PageInfo(componentConstructor, info);

    // alternate implementation
    // return class extends componentConstructor implements PageComponent
    // {
    //     static get pageInfo() { return staticInfo; }
    //     get pageInfo() { return staticInfo; }
    // }

    Object.defineProperty(componentConstructor, "pageInfo", {
      value: staticInfo,
    });
    Object.defineProperty(componentConstructor.prototype, "pageInfo", {
      value: staticInfo,
    });

    // we know this conversion is correct
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    return <DecoratedPageComponent>componentConstructor;
  };
}
