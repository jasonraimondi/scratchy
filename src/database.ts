import { createPool, QueryResultRowType, SqlSqlTokenType, sql } from "slonik";

export const pool = createPool(
  "postgres://scratchy:secret@localhost:30532/scratchy",
);

export const dateParam = (date: Date): SqlSqlTokenType<QueryResultRowType> =>
  sql`TO_TIMESTAMP(${date.getTime()} / 1000.0)`;
