import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

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
  route: libraryRoute,
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
