import { v4 } from "uuid";

export abstract class BaseUuidEntity {
  id: string;

  protected constructor(id?: string) {
    this.id = id ?? v4();
  }
}
