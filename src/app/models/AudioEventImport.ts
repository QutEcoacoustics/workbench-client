import { ANALYSIS_JOB, USER } from "@baw-api/ServiceTokens";
import { addAnnotationImportRoute, annotationImportRoute } from "@components/import-annotations/import-annotations.routes";
import { DateTimeTimezone, Description, HasAllUsers, HasDescription, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { AnalysisJob } from "./AnalysisJob";
import { hasOne } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import { Project } from "./Project";
import { User } from "./User";

export interface IAudioEventImport extends HasAllUsers, HasDescription {
  id?: Id;
  name?: string;
  analysisJobId?: Id;
}

export class AudioEventImport
  extends AbstractModel<IAudioEventImport>
  implements IAudioEventImport
{
  public readonly kind = "audio_event_import";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly name?: string;
  @bawPersistAttr()
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly creatorId?: Id;
  public readonly deleterId?: Id;
  public readonly updaterId?: Id;
  public readonly analysisJobId?: Id;

  // Associations
  @hasOne(USER, "creatorId")
  public creator?: User;
  @hasOne(USER, "deleterId")
  public deleter?: User;
  @hasOne(USER, "updaterId")
  public updater?: User;
  @hasOne(ANALYSIS_JOB, "analysisJobId")
  public analysisJob?: AnalysisJob;

  public get viewUrl(): string {
    throw new Error("Not implemented. Use createViewUrl() method instead.");
  }

  public get addAnnotationsUrl(): string {
    throw new Error("Not implemented. Use createAddAnnotationsUrl() method instead.");
  }

  public createViewUrl(projectId: Id<Project>): string {
    return annotationImportRoute.format({
      annotationId: this.id,
      projectId,
    });
  }

  public createAddAnnotationsUrl(projectId: Id<Project>): string {
    return addAnnotationImportRoute.format({
      annotationId: this.id,
      projectId,
    });
  }
}
