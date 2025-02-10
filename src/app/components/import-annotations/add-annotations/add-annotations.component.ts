import { Component, OnInit } from "@angular/core";
import { audioEventImportResolvers } from "@baw-api/audio-event-import/audio-event-import.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { AudioEventError, ImportedAudioEvent } from "@models/AudioEventImport/ImportedAudioEvent";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import { Observable, takeUntil } from "rxjs";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { FORBIDDEN } from "http-status";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { ActivatedRoute } from "@angular/router";
import { Tag } from "@models/Tag";
import { contains, filterAnd, notIn } from "@helpers/filters/filters";
import { AbstractModel } from "@models/AbstractModel";
import {
  addAnnotationImportMenuItem,
  annotationsImportCategory,
} from "../import-annotations.menu";

interface ImportGroup {
  /** The iterator object of files to be imported */
  files: FileList;
  /** An array of errors encountered during a dry run */
  errors: string[];
  /**
   * List of additional tag IDs that are not found within the imported file and will be associated with every event within the import group
   * This is separate from the identified events because additional tags are typically used for grouping events eg. "testing" and "training"
   */
  additionalTagIds: Id[];
  /** An array of events that were found within the imported file during the dry run */
  identifiedEvents: ImportedAudioEvent[];
  /** Defines whether an import group has uploaded to the baw-api without any errors */
  uploaded: boolean;
}

const audioEventImportKey = "audioEventImport";

@Component({
  selector: "baw-add-annotations",
  templateUrl: "add-annotations.component.html",
  styleUrl: "add-annotations.component.scss",
})
class AddAnnotationsComponent extends PageComponent implements OnInit {
  public constructor(
    private api: AudioEventImportFileService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  protected importGroup: ImportGroup = this.emptyImportGroup;
  protected audioEventImport: AudioEventImport;
  protected uploading: boolean = false;

  // we want to create each new import group from a template by value
  // if it is done by reference, we would be modifying the same import group
  // therefore, we use a getter because they internally work like methods, and return a new object each time
  private get emptyImportGroup(): ImportGroup {
    return {
      files: null,
      additionalTagIds: [],
      errors: [],
      identifiedEvents: [],
      uploaded: false,
    };
  }

  public ngOnInit(): void {
    const routeData = this.route.snapshot.data;
    this.audioEventImport = routeData[audioEventImportKey].model;
  }

  // sends all import groups to the api if there are no errors
  protected async uploadImportGroups(): Promise<void> {
    // importing invalid annotation imports results in an internal server error
    // we should therefore not submit any upload groups if there are any errors
    if (!this.areImportGroupsValid()) {
      return;
    }

    // creates a lock so that no more files can be added to the upload queue while the upload is in progress
    this.uploading = true;

    // we use a "for-of" loop here because if we use a forEach loop (with async callbacks)
    // it doesn't properly await for each import group to finish uploading
    for (const model of this.importGroups) {
      await this.importEventGroup(model);
    }

    this.importGroups = this.importGroups.filter((model) => !model.uploaded);

    this.refreshTables();
    this.uploading = false;
  }

  protected async importEventGroup(model: ImportGroup): Promise<void> {
    if (!model.files) {
      return;
    }

    for (const file of model.files) {
      await this.uploadFile(model, file);
    }
  }

  // callback used by the typeahead input to search for associated tags
  protected searchTagsTypeaheadCallback = (
    text: string,
    activeItems: Tag[]
  ): Observable<Tag[]> =>
    this.tagsApi.filter({
      filter: filterAnd(
        contains<Tag, "text">("text", text),
        notIn<Tag>("text", activeItems)
      ),
    });

  private performDryRun(model: ImportGroup) {
    model.errors = [];
    model.identifiedEvents = [];

    // we perform a dry run of the import to check for errors
    for (const file of model.files) {
      const sentModel: AudioEventImportFile = new AudioEventImportFile({
        id: this.audioEventImport.id,
        file,
        additionalTagIds: model.additionalTagIds,
        commit: false,
      });

      this.api
        .create(sentModel, this.audioEventImport)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((result: AudioEventImportFile) => {
          console.debug(result);
        });
    }
  }

  private uploadFile(
    model: ImportGroup,
    file: File
  ): Promise<void | AudioEventImportFile> {
    const audioEventImportModel: AudioEventImportFile =
      new AudioEventImportFile({
        id: this.audioEventImport.id,
        file,
        additionalTagIds: model.additionalTagIds,
        commit: true,
      });

    return this.api
      .create(audioEventImportModel, this.audioEventImport)
      .pipe(takeUntil(this.unsubscribe))
      .toPromise()
      .finally(() => {
        model.uploaded = true;
      })
      .catch((error: BawApiError) => {
        // some of the default error messages are ambiguous on this page
        // e.g. "you do not have access to this page" means that the user doesn't have access to the audio recording
        if (error.status === FORBIDDEN) {
          model.errors.push(
            "You do not have access to all the audio recordings or tags in your files."
          );
        }
      });
  }

  // because we create a new empty import group if all import groups are full
  // we use this predicate to check if every import group has files
  private areImportGroupsFull(): boolean {
    return this.importGroups.every((model) => model.files !== null);
  }

  // deserialization converts all object keys to camelCase
  // therefore, to make them human readable we add spaces
  private errorToHumanReadable(error: AudioEventError): string[] {
    const errors: string[] = [];

    const errorKeys: string[] = Object.keys(error);

    for (const errorKey of errorKeys) {
      let errorValue: string = error[errorKey].join(", ");

      // sometimes the error value includes the key e.g. "startTimeSeconds is not a number"
      // in this case, we should not prepend the key to the error value
      if (!errorValue.includes(errorKey)) {
        errorValue = `${errorKey} ${errorValue}`;
      }

      errors.push(errorValue);
    }

    return errors;
  }

  // since the typeahead input returns an array of models, but the api wants the associated tags as an array of id's
  // we use this helper function to convert the array of models to an array of id's that can be sent in the api request
  protected getIdsFromAbstractModelArray(items: object[]): Id[] {
    return items.map((item: AbstractModel): Id => item.id);
  }

  protected pushToImportGroups(model: ImportGroup, event): void {
    const files: FileList = event.target.files;
    model.files = files;

    this.performDryRun(model);

    // if the user updates an existing import group, we don't want to create a new one
    // however, if the user uses the last empty import group, we want to create a new empty one
    // that they can use to create a new import group
    if (this.areImportGroupsFull()) {
      this.importGroups.push(this.emptyImportGroup);
    }
  }

  // uses a reference to the ImportGroup object and update the additional tag ids property
  protected updateAdditionalTagIds(
    model: ImportGroup,
    additionalTagIds: Id[]
  ): void {
    model.additionalTagIds = additionalTagIds;
    this.performDryRun(model);
  }

  // a predicate to check if every import group is valid
  // this is used for form validation
  protected areImportGroupsValid(): boolean {
    return this.importGroup.errors.length === 0;
  }

  protected removeFromImport(model: ImportGroup): void {
    const index = this.importGroups.indexOf(model);
    if (index !== -1) {
      this.importGroups.splice(index, 1);
    }
  }
}

AddAnnotationsComponent.linkToRoute({
  category: annotationsImportCategory,
  pageRoute: addAnnotationImportMenuItem,
  resolvers: {
    [audioEventImportKey]: audioEventImportResolvers.show,
  },
});

export { AddAnnotationsComponent };
