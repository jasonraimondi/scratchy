import { GrantIdentifier, OAuthClient } from "@jmondi/oauth2-server";
import { IsOptional, Length } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { generateRandomToken } from "~/lib/random_token";

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
  allowedGrants: GrantIdentifier[];

  @ManyToMany(() => Scope, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinTable({
    name: "oauth_client_scopes",
    joinColumn: { name: "clientId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "scopeId", referencedColumnName: "id" },
  })
  scopes: Scope[];

  @CreateDateColumn()
  createdAt: Date;

  verify(s?: string) {
    return this.secret === s;
  }

  constructor(data?: Partial<Client>) {
    if (data?.name) this.name = data.name;
    this.id = data?.id ?? v4();
    this.secret = data?.secret;
    this.redirectUris = data?.redirectUris ?? [];
    this.allowedGrants = data?.allowedGrants ?? [];
  }
}
