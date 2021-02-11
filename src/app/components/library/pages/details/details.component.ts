import { Component } from "@angular/core";
import { audioEventResolvers } from "@baw-api/audio-event/audio-events.service";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import {
  annotationMenuItem,
  annotationsCategory,
} from "@components/library/library.menus";
import { PageComponent } from "@helpers/page/pageComponent";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-annotation",
  template: "<baw-client></baw-client>",
})
class AnnotationComponent extends PageComponent {}

AnnotationComponent.linkComponentToPageInfo({
  category: annotationsCategory,
  resolvers: {
    audioRecording: audioRecordingResolvers.show,
    audioEvent: audioEventResolvers.show,
  },
}).andMenuRoute(annotationMenuItem);

export { AnnotationComponent };
