import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

// there is a clear distinction between the nav route and the library route because the nav route should never have knowledge of the current
// component route params. The library nav route should instead always act as if its creating a new instance of the library view.
export const libraryNavRoute = StrongRoute.newRoot().add("library");

export const libraryRoute = StrongRoute.newRoot().add("library", (params) =>
  !params
    ? {}
    : {
        tagsPartial: params.tagsPartial,
        reference: params.reference,
        userId: params.userId,
        audioRecordingId: params.audioRecordingId,
        minDuration: params.minDuration,
        maxDuration: params.maxDuration,
        lowFrequency: params.lowFrequency,
        highFrequency: params.highFrequency,
        page: params.page,
        items: params.items,
        sortBy: params.sortBy,
        sortByType: params.sortByType,
      }
);

export const libraryCategory: Category = {
  icon: ["fas", "book"],
  label: "Library",
  route: libraryRoute,
};

export const libraryMenuItem = menuRoute({
  icon: libraryCategory.icon,
  label: "Library",
  route: libraryNavRoute,
  order: 6,
  tooltip: () => "Library of annotations",
});

export const annotationRoute = libraryRoute
  .add(":audioRecordingId")
  .add("audio_events")
  .add(":audioEventId");

export const annotationsCategory: Category = {
  icon: ["fas", "book-open"],
  label: "Annotations",
  route: annotationRoute,
};

export const annotationMenuItem = menuRoute({
  icon: annotationsCategory.icon,
  label: "Annotation",
  route: annotationRoute,
  parent: libraryMenuItem,
  tooltip: () => "Annotation info for a specific audio event in a recording",
});
