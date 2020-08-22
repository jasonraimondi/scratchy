import { SaveOptions } from "typeorm";

export interface IBaseRepository<T> {
  findById(uuid: string): Promise<T>;
  find(): Promise<T[]>;
  save(entity: T, options?: SaveOptions): void;
  delete(uuid: string): void;
}
