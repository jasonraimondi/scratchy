import { PaginatorInputs, PaginatorResponse } from "~/generated/entities";

export function paginatorInputs(input: PaginatorInputs) {
  return {
    take: input.take,
    skip: input.cursorId ? 1 : undefined,
    cursor: input.cursorId ? { id: input.cursorId } : undefined,
  };
}

export type HasId = { id: string };

export function paginatorResponse<T extends HasId>(inputs: PaginatorInputs, response: PaginatorResponse<T>) {
  const arr = response.data;
  response.cursorId = arr?.[arr.length - 1]?.id;

  // there is no next cursor
  if (inputs.take > arr.length) {
    response.cursorId = undefined;
  }

  return response;
}
