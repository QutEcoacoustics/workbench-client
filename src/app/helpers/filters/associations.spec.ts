import { InnerFilter } from "@baw-api/baw-api.service";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { associationModelFilter, MergeStrategy } from "./associations";
import { filterOr } from "./filters";

interface AssociationModelFilterTest {
  name: string;
  input: {
    associationFilter: InnerFilter<Project>;
    baseFilter?: InnerFilter<Site>;
    operator?: MergeStrategy;
  };

  // The expected filter is the same as the base filter because the association
  // filter should be merged into the base site filter.
  expected: InnerFilter<Site>;
}

const siteFilter: InnerFilter<Site> = { name: { contains: "test" } };
const projectFilter: InnerFilter<Project> = { id: { eq: 1 } };

// We need this "as any" cast here because the filter typings don't have
// association typings.
//
// TODO: Remove this "as any" cast once we fix the typing issues
// see: https://github.com/QutEcoacoustics/workbench-client/issues/1777
const projectAssociationFilter: InnerFilter<Site> = { "project.id": { eq: 1 } } as any;

const tests: AssociationModelFilterTest[] = [
  {
    name: "should prefix association filter keys and merge with base filter using AND by default",
    input: {
      associationFilter: projectFilter,
      baseFilter: siteFilter,
    },
    expected: {
      and: [siteFilter, projectAssociationFilter],
    },
  },
  {
    name: "should prefix keys and merge with base filter using OR if specified",
    input: {
      associationFilter: projectFilter,
      baseFilter: siteFilter,
      operator: filterOr,
    },
    expected: {
      or: [siteFilter, projectAssociationFilter],
    },
  },
  {
    name: "should handle a non-existent base filter",
    input: {
      associationFilter: projectFilter,
    },
    expected: projectAssociationFilter,
  },
  {
    name: "should handle an empty base filter",
    input: {
      associationFilter: projectFilter,
      baseFilter: {},
    },
    expected: projectAssociationFilter,
  },
  {
    name: "should handle empty association filter",
    input: {
      associationFilter: {},
      baseFilter: siteFilter,
    },
    expected: siteFilter,
  },
  {
    name: "should handle empty association and base filters",
    input: {
      associationFilter: {},
      baseFilter: {},
    },
    expected: {},
  },
];

describe("associationModelFilter", () => {
  tests.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = associationModelFilter(
        "project",
        input.associationFilter,
        input.baseFilter,
        input.operator
      );

      expect(result).toEqual(expected);
    });
  });
});
