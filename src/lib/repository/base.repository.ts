import { SaveOptions } from "typeorm";

export interface IBaseRepository<T> {
  findById(id: string): Promise<T>;
  find(): Promise<T[]>;
  save(entity: T, options?: SaveOptions): void;
  delete(id: string): void;
}
