import { Column, Entity, PrimaryColumn } from "typeorm";

import { v4 } from "uuid";

@Entity("oauth_clients")
export class Client {
  @PrimaryColumn("uuid")
  readonly id: string;

  @Column({ nullable: true })
  secret?: string;

  @Column({ unique: true })
  name: string;

  @Column("simple-array")
  redirectUris: string[];

  get isConfidential(): boolean {
    return !!this.secret;
  }

  verify(s: string) {
    return this.secret === s;
  }

  constructor(name: string, secret?: string, id?: string) {
    this.name = name;
    this.id = id ?? v4();
    this.redirectUris = [];
  }
}
