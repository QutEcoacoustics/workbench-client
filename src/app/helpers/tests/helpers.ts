export function assertIcon(target: HTMLElement, prop: string) {
  const icon: HTMLElement = target.querySelector("fa-icon");
  expect(icon).toBeTruthy("No icon detected");
  expect(icon.attributes.getNamedItem("ng-reflect-icon")).toBeTruthy();
  expect(icon.attributes.getNamedItem("ng-reflect-icon").value.trim()).toBe(
    prop
  );
}

export function assertTooltip(target: HTMLElement, tooltip: string) {
  expect(target).toBeTruthy("No tooltip detected");

  let attr = target.attributes.getNamedItem("ng-reflect-ngb-tooltip");

  if (!attr) {
    attr = target.attributes.getNamedItem("ng-reflect-tooltip");
  }

  expect(attr).toBeTruthy();
  expect(attr.value.trim()).toBe(tooltip);

  // TODO Add accessability expectations
}

export function assertRoute(target: HTMLElement, route: string) {
  expect(target).toBeTruthy("No route detected");
  expect(target.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
  expect(
    target.attributes.getNamedItem("ng-reflect-router-link").value.trim()
  ).toBe(route);
}
