import { SaveOptions } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

export interface IBaseRepository<T> {
  findById(id: string): Promise<T>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  save(entity: T, options?: SaveOptions): void;
  delete(id: string): void;
}
