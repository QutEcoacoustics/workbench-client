
export interface RouteParameter {
    name: string;
    default?: any;
}

function isRouteParameter(fragment: any): fragment is RouteParameter {
    return "name" in fragment;
}

export type RouteSet = (string | RouteParameter)[];

export class StrongRoute {
    private fullRoute: string;
    private parameters: RouteParameter[];
    private fragments: (string | RouteParameter)[];

    constructor(fragments: RouteSet) {
        let route = "";
        const parameters = [];
        for (let i = 0; i < fragments.length; i++) {
            const delimiter = i === fragments.length - 2 ? "" : "/";
            const current = fragments[i];
            if (isRouteParameter(current)) {
                route += current.name + delimiter;
            } else {
                route += current + delimiter;
            }
        }
        this.fullRoute = route;
        this.parameters = parameters;
        this.fragments = fragments;
    }

    format(...args: string[]): string[] {
        if (args.length !== this.parameters.length) {
            throw new Error(`Got ${args.length} route arguments but expected ${this.parameters.length}`);
        }

        const params = args;
        const prepareParam = (x: string) => {
            if (isRouteParameter(x)) {
                const param = params.shift() || x.default;
                if (param) {
                    return param;
                } else {
                    throw new Error(`Parameter named ${x.name} was not supplied a value and a default value was not given`);
                }
            } else {
                return x;
            }
        };

        return this.fragments.map(prepareParam);
    }

    toString(): string {
        return this.fullRoute;
    }

    get ngStringRoute() {
        return this.fullRoute;
    }
}

export function MakeRoute(...fragments: RouteSet) {
    return new StrongRoute(fragments);
}

export const BaseRoute = new StrongRoute([]);
