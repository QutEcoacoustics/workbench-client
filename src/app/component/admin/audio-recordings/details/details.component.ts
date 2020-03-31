import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { FormTemplate } from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AudioRecording } from "src/app/models/AudioRecording";
import { audioRecordingResolvers } from "src/app/services/baw-api/audio-recording.service";
import {
  adminAudioRecordingCategory,
  adminAudioRecordingMenuItem,
  adminAudioRecordingsMenuItem
} from "../../admin.menus";
import { fields } from "./audioRecording.json";

const audioRecordingKey = "audioRecording";

@Page({
  category: adminAudioRecordingCategory,
  menus: {
    links: List(),
    actions: List([adminAudioRecordingsMenuItem, adminAudioRecordingMenuItem])
  },
  resolvers: {
    [audioRecordingKey]: audioRecordingResolvers.show
  },
  self: adminAudioRecordingMenuItem
})
@Component({
  selector: "app-admin-audio-recording",
  template: `
    <app-form
      *ngIf="!failure"
      title="Audio Recording Details"
      [model]="model"
      [fields]="fields"
      [noSubmit]="true"
    ></app-form>
  `
})
export class AdminAudioRecordingComponent extends FormTemplate<AudioRecording> {
  public fields = fields;

  constructor(
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, audioRecordingKey, () => "");
  }

  // No API Action
  protected apiAction(): Observable<void | AudioRecording> {
    throw new Error("Method not implemented.");
  }
}
