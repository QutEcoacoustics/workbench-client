import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Question } from "@models/Question";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateQuestion } from "@test/fakes/Question";
import { validateStandardApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { ShallowQuestionsService } from "./questions.service";

describe("ShallowQuestionsService", (): void => {
  const createModel = () => new Question(generateQuestion({ id: 5 }));
  const baseUrl = "/questions/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ShallowQuestionsService>;
  const createService = createServiceFactory({
    service: ShallowQuestionsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Question,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
