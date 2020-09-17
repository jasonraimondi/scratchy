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
import { Scope } from "~/entity/oauth/scope.entity";
import { User } from "~/entity/user/user.entity";

@Entity("oauth_auth_codes")
export class AuthorizationCode {
  @PrimaryColumn("uuid")
  readonly token: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Index()
  @Column("uuid")
  @IsUUID()
  userId: string;

  @ManyToOne(() => Client)
  client: Client;

  @Index()
  @Column("uuid")
  @IsUUID()
  clientId: string;

  @Column()
  redirectUri: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Scope)
  @JoinTable({
    name: "oauth_auth_code_scopes",
    joinColumn: { name: "authCodeToken", referencedColumnName: "token" },
    inverseJoinColumn: { name: "scopeId", referencedColumnName: "id" },
  })
  scopes: Scope[];

  revoke() {
    this.expiresAt = new Date(0);
  }

  constructor(client: Client, user: User, token?: string) {
    this.client = client;
    this.user = user;
    this.token = token ?? v4();
    this.expiresAt = addDays(new Date(), 30);
  }
}

export const addDays = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return date;
};
