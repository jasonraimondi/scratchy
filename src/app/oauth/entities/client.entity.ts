import { OAuthClient } from "@jmondi/oauth2-server";
import { GrantTypeIdentifiers } from "@jmondi/oauth2-server";
import { IsOptional, Length } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

@Entity("oauth_clients")
export class Client implements OAuthClient {
  @PrimaryColumn("uuid")
  readonly id: string;

  @Column("varchar", { length: 128, nullable: true })
  @Length(64, 128)
  @IsOptional()
  secret?: string;

  @Column("varchar", { length: 128 })
  name: string;

  @Column("simple-array")
  redirectUris: string[];

  @Column("simple-array")
  allowedGrants: GrantTypeIdentifiers[];

  get isConfidential(): boolean {
    return !!this.secret;
  }

  verify(s?: string) {
    return this.secret === s;
  }

  constructor(data?: Partial<Client>) {
    if (data?.name) this.name = data.name;
    this.id = data?.id ?? v4();
    this.redirectUris = data?.redirectUris ?? [];
    this.allowedGrants = data?.allowedGrants ?? [];
  }
}
