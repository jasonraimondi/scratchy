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

  @Column("simple-array")
  allowedGrants: string[];

  get isConfidential(): boolean {
    return !!this.secret;
  }

  verify(s: string) {
    return this.secret === s;
  }

  constructor(data?: Partial<Client>) {
    if (data?.name) this.name = data.name;
    this.id = data?.id ?? v4();
    this.redirectUris = data?.redirectUris ?? [];
    this.allowedGrants = data?.allowedGrants ?? [];
  }
}
