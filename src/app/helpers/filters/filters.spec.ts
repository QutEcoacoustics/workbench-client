import { InnerFilter } from "@baw-api/baw-api.service";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { Id } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { filterAnd, filterModel, filterModelIds, filterOr } from "./filters";

describe("ModelFilters", () => {
  describe("filterAnd", () => {
    it("should return the inner filter unchanged if there is no existing filter", () => {
      const currentFilters = undefined;
      const additionalFilters = {
        ["projects.id"]: {
          eq: 1,
        },
      } as InnerFilter;

      const observedResult = filterAnd(currentFilters, additionalFilters);
      expect(observedResult).toEqual(additionalFilters);
    });

    it("should create an 'and' condition if there is no and condition for a newly multi conditional filter", () => {
      const currentFilters = {
        "projects.id": {
          eq: 1,
        },
      } as InnerFilter<AudioRecording>;
      const additionalFilters: InnerFilter<AudioRecording> = {
        recordedDate: { greaterThan: "2021-10-10" },
      };

      const expectedResult: InnerFilter = {
        and: [
          {
            ["projects.id"]: {
              eq: 1,
            },
          },
          {
            recordedDate: { greaterThan: "2021-10-10" },
          },
        ],
      };

      const observedResult = filterAnd(currentFilters, additionalFilters);
      expect(observedResult).toEqual(expectedResult);
    });

    it("should append the a condition to the 'and' block if there is an existing 'and' conditional block", () => {
      const currentFilters: InnerFilter = {
        and: [
          {
            ["projects.id"]: { eq: 1 },
          },
          {
            recordedDate: { greaterThan: "2021-10-10" },
          },
        ],
      };

      const additionalFilters = {
        "sites.id": {
          in: [{ eq: 1 }, { eq: 2 }],
        },
      } as InnerFilter<AudioRecording>;

      const expectedResult: InnerFilter<AudioRecording> = {
        and: [
          {
            ["projects.id"]: {
              eq: 1,
            },
          },
          {
            recordedDate: { greaterThan: "2021-10-10" },
          },
          {
            ["sites.id"]: {
              in: [{ eq: 1 }, { eq: 2 }],
            },
          },
        ],
      };

      const observedResult = filterAnd(currentFilters, additionalFilters);
      expect(observedResult).toEqual(expectedResult);
    });
  });

  describe("filterOr", () => {
    it("should return the inner filter unchanged if there is no existing filter", () => {
      const baseFilters = undefined;
      const newFilters = { id: { eq: 1 } };

      const realizedResult = filterOr(baseFilters, newFilters);
      expect(realizedResult).toEqual(newFilters);
    });

    it("should create an 'or' condition if there is no or condition for a newly multi conditional filter", () => {
      const baseFilters = { id: { eq: 1 } };
      const newFilters: InnerFilter<AudioRecording> = {
        recordedDate: { greaterThan: "2021-10-10" },
      };

      const expectedResult: InnerFilter<AudioRecording> = {
        or: [
          { id: { eq: 1 } },
          { recordedDate: { greaterThan: "2021-10-10" } },
        ],
      };

      const realizedResult = filterOr(baseFilters, newFilters);
      expect(realizedResult).toEqual(expectedResult);
    });

    it("should append the a condition to the 'or' block if there is an existing 'or' block", () => {
      const baseFilters: InnerFilter<AudioRecording> = {
        or: [
          { id: { eq: 1 } },
          { recordedDate: { greaterThan: "2021-10-10" } },
        ],
      };

      const newFilters: InnerFilter<AudioRecording> = {
        durationSeconds: { gt: 1_000 },
      };

      const expectedResult: InnerFilter<AudioRecording> = {
        or: [
          { id: { eq: 1 } },
          { recordedDate: { greaterThan: "2021-10-10" } },
          { durationSeconds: { gt: 1_000 } },
        ],
      };

      const observedResult = filterOr(baseFilters, newFilters);
      expect(observedResult).toEqual(expectedResult);
    });

    it("should interact with 'and' conditions correctly", () => {
      const baseFilters: InnerFilter<AudioRecording> = {
        or: [
          { id: { eq: 1 } },
          {
            and: [
              { recordedDate: { greaterThan: "2021-10-10" } },
              { durationSeconds: { gt: 1_000 } },
            ],
          },
        ],
      };

      const newFilters: InnerFilter<AudioRecording> = {
        siteId: { in: [1, 2, 3] },
      };

      const expectedResult: InnerFilter<AudioRecording> = {
        or: [
          { id: { eq: 1 } },
          {
            and: [
              { recordedDate: { greaterThan: "2021-10-10" } },
              { durationSeconds: { gt: 1_000 } },
            ],
          },
          { siteId: { in: [1, 2, 3] } },
        ],
      };

      const realizedResult = filterOr(baseFilters, newFilters);
      expect(realizedResult).toEqual(expectedResult);
    });
  });

  it("should return an empty filter if no model is specified", () => {
    const mockModel: Project = undefined;
    const initialFilters: InnerFilter<Project> = {};

    const observedResult = filterModel<Project, any>("projects", mockModel, initialFilters) as any;
    expect(observedResult).toEqual(initialFilters);
  });

  it("should return an empty filter if the model does not have an id property", () => {
    const mockModel = new Project(generateProject({ id: undefined }));
    const initialFilters: InnerFilter<Project> = {};

    const observedResult = filterModel<Project, any>("projects", mockModel, initialFilters) as any;
    expect(observedResult).toEqual(initialFilters);
  });

  it("should return the exiting filter unmodified if no model is specified", () => {
    const mockModel: Project = undefined;
    const currentFilters = {
      ["regions.id"]: {
        eq: 1,
      },
    } as InnerFilter<Project>;

    const observedResult = filterModel<Project, any>("projects", mockModel, currentFilters) as any;
    expect(observedResult).toEqual(currentFilters);
  });

  it("should return the exiting filter unmodified if the model does not have an id property", () => {
    const mockModel = new Project(generateProject({ id: undefined }));
    const currentFilters = {
      ["regions.id"]: {
        eq: 1,
      },
    } as InnerFilter<Project>;

    const observedResult = filterModel<Project, any>("projects", mockModel, currentFilters) as any;
    expect(observedResult).toEqual(currentFilters);
  });

  it("should create the correct model filter for a project", () => {
    const mockProject = new Project(generateProject({ id: 11 }));
    const initialFilters: InnerFilter<Project> = {};
    const expectedResult = {
      ["projects.id"]: {
        eq: mockProject.id,
      },
    } as InnerFilter<Project>;

    const observedResult = filterModel<Project, any>("projects", mockProject, initialFilters) as any;
    expect(observedResult).toEqual(expectedResult);
  });

  it("should create the correct modelId filter for an array of project ids", () => {
    const mockProjectIds: Id[] = [12, 231, 4123];
    const initialFilters: InnerFilter<Project> = {};
    const expectedResult = {
      ["projects.id"]: {
        in: mockProjectIds,
      },
    } as InnerFilter<Project>;

    const observedResult = filterModelIds<Project>("projects", mockProjectIds, initialFilters);
    expect(observedResult).toEqual(expectedResult);
  });
});
