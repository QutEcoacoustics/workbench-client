import { Id, Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export abstract class AbstractSetting extends AbstractModel {
  public readonly id?: Id;
  public readonly name?: Param;
}
