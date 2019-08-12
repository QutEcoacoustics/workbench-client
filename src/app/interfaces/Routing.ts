
import { Type } from "@angular/core";
import { Route } from "@angular/router";

export type ConfigCallback = (component: Type<any> | null, config: Partial<Route>) => void;

export class StrongRoute {
    private readonly parameters: StrongRoute[];
    private readonly full: StrongRoute[];

    private readonly config: Partial<Route>;
    readonly root: any;
    readonly parent: StrongRoute;
    readonly name: string;
    readonly isParameter: boolean;
    readonly fullRoute: string;
    readonly children: StrongRoute[] = [];
    pageComponent: Type<any> | null;

    private constructor(parent: StrongRoute, name: string, config) {
        this.name = name;

        if (parent) {
            this.parent = parent;
            this.root = parent.root;
            this.parent.children.push(this);
            this.isParameter = name.startsWith(":");
        } else {
            this.parent = null;
            this.root = this;
            this.isParameter = false;
        }

        this.config = { path: name, ...config};

        const [full, parameters] = this.rootToHere();
        this.full = full;
        this.parameters = parameters;
        this.fullRoute = full.map(x => x.name).join("/");
    }

    static get Base() {
        return  new StrongRoute(null, null, { });
    }

    add(name: string, config: Partial<Route> = {}) {
        return new StrongRoute(this, name, config);
    }

    format(...args: string[]): string[] {
        if (args.length !== this.parameters.length) {
            throw new Error(`Got ${args.length} route arguments but expected ${this.parameters.length}`);
        }

        const params = args;
        const prepareParam = (x: StrongRoute) => {
            if (x.isParameter) {
                const param = params.shift();
                if (param) {
                    return param;
                } else {
                    throw new Error(`Parameter named ${x.name} was not supplied a value and a default value was not given`);
                }
            } else {
                return x.name;
            }
        };

        return this.full.map(prepareParam);
    }

    compileRoutes(callback: ConfigCallback) {
        const rootRoute = this.root;

        const recursiveAdd = (current: StrongRoute): Route => {
            // provide an opportunity to modify the route config just before we
            // generate it.
            callback(current.pageComponent, current.config);
            const thisRoute = current.routeConfig;
            const childRoutes = current.children.map(recursiveAdd);
            // TODO: the order of these arrays may well need to be changed...
            // depends on how nested routes work
            // we want "" to match current
            // but e.g. "sites" to go down a level
            // and not for both to match at same time.
            thisRoute.children = [...(thisRoute.children || []), ...childRoutes];
            return thisRoute;
        };

        return rootRoute.children.map(recursiveAdd);
    }

    toString(): string {
        return this.fullRoute;
    }

    get routeConfig() {
        return this.config;
    }

    private rootToHere(): [StrongRoute[], StrongRoute[]] {
        const fragments = [];
        const parameters = [];
        let current: StrongRoute = this;
        while (current != null) {
            fragments.push(current);
            if (current.isParameter) {
                parameters.push(current);
            }
            current = current.parent;
        }

        return [fragments.reverse(), parameters.reverse()];
    }

}
