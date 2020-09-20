import { DefaultNamingStrategy, Table, NamingStrategyInterface } from "typeorm";

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    tableOrName = typeof tableOrName === "string" ? tableOrName : tableOrName.name;
    tableOrName = tableOrName.replace(/_/g, "");

    const name = columnNames.reduce((name, column) => `${name}_${column}`, tableOrName);
    return `pkey_${name.toLowerCase()}`;
  }

  indexName(tableOrName: Table | string, columnNames: string[]): string {
    tableOrName = typeof tableOrName === "string" ? tableOrName : tableOrName.name;
    tableOrName = tableOrName.replace(/_/g, "");

    const name = columnNames.reduce((name, column) => `${name}_${column}`, tableOrName);
    return `idx_${name.toLowerCase()}`;
  }

  foreignKeyName(tableOrName: Table | string, columnNames: string[], referencedTablePath?: string): string {
    tableOrName = typeof tableOrName === "string" ? tableOrName : tableOrName.name;
    tableOrName = tableOrName.replace(/_/g, "");
    referencedTablePath = referencedTablePath?.replace(/_/g, "");
    const name = columnNames.reduce((name, column) => `${name}_${column}`, `${tableOrName}_${referencedTablePath}`);
    return `fkey_${name.toLowerCase()}`;
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    tableOrName = typeof tableOrName === "string" ? tableOrName : tableOrName.name;
    tableOrName = tableOrName.replace(/_/g, "");

    const name = columnNames.reduce((name, column) => `${name}_${column}`, tableOrName);
    return `unq_${name.toLowerCase()}`;
  }
}
