import { IsUUID } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 } from "uuid";

import { Client } from "~/entity/oauth/client.entity";
import { RefreshToken } from "~/entity/oauth/refresh_token.entity";
import { Scope } from "~/entity/oauth/scope.entity";
import { User } from "~/entity/user/user.entity";

@Entity("oauth_access_tokens")
export class AccessToken {
  @PrimaryColumn("uuid")
  readonly token: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: "clientId" })
  client: Client;

  @Index()
  @Column("uuid")
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Index()
  @Column("uuid")
  @IsUUID()
  userId: string;

  @ManyToOne(() => RefreshToken)
  @JoinColumn({ name: "refreshTokenToken" })
  refreshToken?: RefreshToken;

  @Column("uuid")
  refreshTokenToken?: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Scope)
  @JoinTable({
    name: "oauth_access_token_scopes",
    joinColumn: { name: "accessTokenToken", referencedColumnName: "token" },
    inverseJoinColumn: { name: "scopeId", referencedColumnName: "id" },
  })
  scopes: Scope[];

  constructor(client: Client, user: User, token?: string) {
    this.client = client;
    this.user = user;
    this.token = token ?? v4();
  }
}
