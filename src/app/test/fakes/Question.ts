import { Id } from "@interfaces/apiInterfaces";
import { IQuestion } from "@models/Question";
import { modelData } from "@test/helpers/faker";

export function generateQuestion(id?: Id): IQuestion {
  return {
    id: modelData.id(id),
    text: modelData.notes(), // TODO This may not be the correct type
    data: modelData.notes(), // TODO This may not be the correct type
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
  };
}
