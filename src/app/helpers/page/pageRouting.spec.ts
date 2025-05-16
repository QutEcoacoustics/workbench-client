import { RenderMode, ServerRoute } from "@angular/ssr";
import { StrongRoute } from "@interfaces/strongRoute";
import { Routes } from "@angular/router";
import { generatePageInfo } from "@test/fakes/PageInfo";
import { generateMenuRoute } from "@test/fakes/MenuItem";
import { compileAndSplitRoutes, splitIndexedStrongRoutes } from "./pageRouting";
import { IPageInfo, PageInfo } from "./pageInfo";

interface CompileAndSplitRoutesTest {
  name: string;
  strongRoutes: StrongRoute[];
  expected: {
    clientRoutes: Routes;
    serverRoutes: ServerRoute[] | any;
  };
}

function createMockStrongRoute(
  path: string,
  pageInfoData?: Partial<IPageInfo>,
): StrongRoute {
  const rootRoute = StrongRoute.newRoot();
  const testRoute = rootRoute.add(path);

  const testPageInfo = new PageInfo(
    generatePageInfo({
      pageRoute: generateMenuRoute({
        route: testRoute,
      }),
      ...pageInfoData,
    }),
  );

  testRoute.pageComponent = jasmine.createSpyObj("pageComponent", [
    "pageInfos",
  ]);
  testRoute.pageComponent["pageInfos"] = [testPageInfo];

  return testRoute;
}

describe("pageRouting", () => {
  describe("splitIndexedStrongRoutes", () => {
    it("should correctly split an object with keyed StrongRoute's", () => {
      const projectsRoute = createMockStrongRoute("projects");
      const recordingsRoute = createMockStrongRoute("audio_recordings");

      const testInput = {
        projectList: projectsRoute,
        projectDetailsRoute: recordingsRoute,
      };

      const expectedOutput = [projectsRoute, recordingsRoute];
      const realizedOutput = splitIndexedStrongRoutes(testInput);

      expect(realizedOutput).toEqual(expectedOutput);
    });

    it("should return an empty array for an object with no keys", () => {
      const realizedResult = splitIndexedStrongRoutes({});
      expect(realizedResult).toEqual([]);
    });
  });

  describe("compileAndSplitRoutes", () => {
    const tests: CompileAndSplitRoutesTest[] = [
      {
        name: "should correctly split a StrongRoute array into client and server routes",
        strongRoutes: [
          StrongRoute.newRoot().add("projects"),
          StrongRoute.newRoot().add("audio_recordings"),
        ],
        expected: {
          clientRoutes: [{ path: "projects" }, { path: "audio_recordings" }],
          serverRoutes: [
            { path: "projects", renderMode: jasmine.anything() },
            { path: "audio_recordings", renderMode: jasmine.anything() },
          ],
        },
      },
      {
        name: "should behave correctly if one StrongRoute is passed in",
        strongRoutes: [createMockStrongRoute("projects")],
        expected: {
          clientRoutes: [{ path: "projects" }],
          serverRoutes: [{ path: "projects", renderMode: jasmine.any(Number) }],
        },
      },
      {
        name: "should return no routes if no strong routes are passed in",
        strongRoutes: [],
        expected: {
          clientRoutes: [],
          serverRoutes: [],
        },
      },
    ];

    for (const test of tests) {
      it(test.name, () => {
        const [clientRoutes, serverRoutes] = compileAndSplitRoutes(
          test.strongRoutes,
        );

        // There should be one server route for every client route.
        // Therefore, there should be the same number of client routes as server
        // routes.
        expect(clientRoutes.length).toEqual(serverRoutes.length);

        for (const routeIndex in clientRoutes) {
          const expectedClientRoute = test.expected.clientRoutes[routeIndex];
          const realizedClientRoute = clientRoutes[routeIndex];

          const expectedServerRoute = test.expected.serverRoutes[routeIndex];
          const realizedServerRoute = serverRoutes[routeIndex];

          expect(realizedClientRoute).toEqual(
            jasmine.objectContaining(expectedClientRoute),
          );

          expect(realizedServerRoute).toEqual(
            jasmine.objectContaining(expectedServerRoute),
          );
        }
      });
    }

    describe("renderMode", () => {
      it("should correctly retain 'Client' renderMode overrides", () => {
        const clientRenderedRoute = createMockStrongRoute("projects", {
          renderMode: RenderMode.Client,
        });

        const [clientRoutes, serverRoutes] = compileAndSplitRoutes([
          clientRenderedRoute,
        ]);

        expect(clientRoutes.length).toEqual(1);
        expect(serverRoutes.length).toEqual(1);

        expect(serverRoutes[0]).toEqual(
          jasmine.objectContaining({
            renderMode: RenderMode.Client,
          }),
        );

        // This assertion is to ensure we should not be leaking ServerRoute
        // information to the client.
        expect("renderMode" in clientRoutes[0]).toBeFalse();
      });

      it("should default to 'Server' renderMode", () => {
        const serverRenderedRoute = createMockStrongRoute("projects", {
          renderMode: undefined,
        });

        const [clientRoutes, serverRoutes] = compileAndSplitRoutes([
          serverRenderedRoute,
        ]);

        expect(clientRoutes.length).toEqual(1);
        expect(serverRoutes.length).toEqual(1);

        expect(serverRoutes[0]).toEqual(
          jasmine.objectContaining({
            renderMode: RenderMode.Server,
          }),
        );

        expect("renderMode" in clientRoutes[0]).toBeFalse();
      });
    });
  });
});
