import { IQuestion } from "@models/Question";
import { modelData } from "@test/helpers/faker";

export function generateQuestion(
  data?: Partial<IQuestion>
): Required<IQuestion> {
  return {
    id: modelData.id(),
    text: modelData.html(),
    data: modelData.notes(),
    ...modelData.model.generateCreatorAndUpdater(),
    ...data,
  };
}
