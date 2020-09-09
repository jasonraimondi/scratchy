import { SaveOptions } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

export interface IBaseRepository<T> {
  findById(id: string): Promise<T>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  save(entity: T, options?: SaveOptions): Promise<T[]>;
  delete(id: string): Promise<DeleteResult>;
}
