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

import { Client } from "~/app/oauth/entities/client.entity";
import { RefreshToken } from "~/app/oauth/entities/refresh_token.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
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

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  user?: User;

  @Index()
  @Column("uuid", { nullable: true })
  @IsUUID()
  userId?: string;

  @ManyToOne(() => RefreshToken, { nullable: true })
  @JoinColumn({ name: "refreshTokenToken" })
  refreshToken?: RefreshToken;

  @Column("uuid", { nullable: true })
  refreshTokenToken?: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Scope, { nullable: true })
  @JoinTable({
    name: "oauth_access_token_scopes",
    joinColumn: { name: "accessTokenToken", referencedColumnName: "token" },
    inverseJoinColumn: { name: "scopeId", referencedColumnName: "id" },
  })
  scopes?: Scope[];

  get toJWT() {
    return {
      token: this.token,
      email: this.user?.email,
      userId: this.userId,
      isActive: this.user?.isActive,
    };
  }

  constructor(client: Client, user?: User, token?: string) {
    this.client = client;
    this.user = user;
    this.token = token ?? v4();
  }
}
