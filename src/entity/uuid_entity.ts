import { v4 } from "uuid";

export abstract class BaseUuidEntity {
  id: string;

  protected constructor(id?: string) {
    if (!id) id = v4();
    this.id = id;
  }
}
