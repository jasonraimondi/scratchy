import { DateInterval } from "@jmondi/date-interval";
import { OAuthAccessToken } from "@jmondi/oauth2-server";
import { IsUUID, Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

import { Client } from "~/app/oauth/entities/client.entity";
import { generateRandomToken } from "~/app/oauth/entities/random_token";
import { RefreshToken } from "~/app/oauth/entities/refresh_token.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { User } from "~/entity/user/user.entity";

@Entity("oauth_access_tokens")
export class AccessToken implements OAuthAccessToken {
  @PrimaryColumn("varchar", { length: 128 })
  @Length(64, 128)
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

  @OneToOne(() => RefreshToken, { nullable: true })
  @JoinColumn({ name: "refreshTokenToken" })
  refreshToken?: RefreshToken;

  @Column("varchar", { length: 128, nullable: true })
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

  get identifier() {
    return this.token;
  }

  get toJWT() {
    return {
      token: this.token,
      email: this.user?.email,
      userId: this.userId,
      isActive: this.user?.isActive,
    };
  }

  constructor(data?: Partial<AccessToken>) {
    this.setClient(data?.client);
    this.setRefreshToken(data?.refreshToken);
    this.setUser(data?.user);
    this.token = data?.token ?? generateRandomToken();
    // @todo the new date interval is misleading here;
    this.expiresAt = data?.expiresAt ?? new DateInterval({ months: 1 }).end();
  }

  private setClient(client?: Client) {
    if (client) {
      this.client = client;
      this.clientId = client?.id;
    }
  }

  private setUser(user?: User) {
    if (user) {
      this.user = user;
      this.userId = user?.id;
    }
  }

  private setRefreshToken(refreshToken?: RefreshToken) {
    if (refreshToken) {
      this.refreshToken = refreshToken;
      this.refreshTokenToken = refreshToken.refreshToken;
    }
  }
}
