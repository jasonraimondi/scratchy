import { DeepPartial, FindConditions, FindOneOptions, RemoveOptions, Repository, SaveOptions } from "typeorm";
import { buildPaginator } from "typeorm-cursor-pagination";
import { PagniationOtions } from "typeorm-cursor-pagination/src/index";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";

type id = number | string;
//
// export interface IBaseRepository<T> {
//   findAll(options: FindManyOptions<T>): Promise<any>;
//
//   findById(id: id, options?: FindOneOptions<T>): Promise<any>;
//
//   findOneBy(where: FindConditions<T>, relations?: string[]): Promise<any>;
//
//   findByIds(ids: id[], options?: FindManyOptions<T>): Promise<any>;
//
//   newModel(entity: DeepPartial<T>): Promise<any>;
//
//   create(entity: DeepPartial<T>, options?: SaveOptions): Promise<any>;
//
//   update(id: id, partial: QueryDeepPartialEntity<T>, options?: FindOneOptions<T>): Promise<any>;
//
//   save(entity: T, options?: SaveOptions): Promise<any>;
//
//   delete(id: id, options?: FindOneOptions<T>): Promise<any>;
//
//   remove(entities: T[], options?: RemoveOptions): Promise<any>;
// }

export type IBaseRepo<T> = BaseRepository<T>;

export abstract class BaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async paginate(queryBuilder: SelectQueryBuilder<T>, options: PagniationOtions<T>) {
    const paginator = buildPaginator(options);
    return await paginator.paginate(queryBuilder);
  }

  async findAll(options: FindManyOptions<T> = {}) {
    return await this.repository.find(options);
  }

  async findById(id: id, options: FindOneOptions<T> = {}) {
    return await this.repository.findOneOrFail(id, options);
  }

  async findOneBy(where: FindConditions<T>, relations: string[] = []) {
    return await this.repository.findOneOrFail({ where, relations });
  }

  async findByIds(ids: id[], options: FindManyOptions<T> = {}) {
    return await this.repository.findByIds(ids, options);
  }

  async newModel(entity: DeepPartial<T>) {
    return this.repository.create(entity);
  }

  async create(entity: DeepPartial<T>, options: SaveOptions = {}) {
    const result = await this.newModel(entity);
    return await this.save(result, options);
  }

  async update(id: id, partial: QueryDeepPartialEntity<T>, options: FindOneOptions<T> = {}) {
    await this.repository.update(id, partial);
    return this.findById(id, options);
  }

  async save(entity: T, options: SaveOptions = {}) {
    return await this.repository.save<T>(entity, options);
  }

  async delete(id: id, options: FindOneOptions<T> = {}) {
    const entity = this.repository.findOneOrFail(id, options);
    await this.repository.delete(id);
    return entity;
  }

  async remove(entities: T[], options: RemoveOptions = {}) {
    return await this.repository.remove(entities, options);
  }
}
