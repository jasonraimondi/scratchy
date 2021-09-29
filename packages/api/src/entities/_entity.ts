export type EntityConstructor<Model, Relations, Required extends keyof Model> = Partial<Model> &
  Pick<Model, Required> &
  Relations;

export abstract class Entity<Model> {
  abstract toEntity(): Model;
  protected constructor(protected readonly relations: string[]) {}
}
