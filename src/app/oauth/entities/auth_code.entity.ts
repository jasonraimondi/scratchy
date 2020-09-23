import { DateInterval } from "@jmondi/date-interval";
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
  PrimaryColumn,
} from "typeorm";

import { Client } from "~/app/oauth/entities/client.entity";
import { generateRandomToken } from "~/app/oauth/entities/random_token";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { User } from "~/entity/user/user.entity";

@Entity("oauth_auth_codes")
export class AuthCode {
  @PrimaryColumn("varchar", { length: 128 })
  @Length(64, 128)
  token: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  user?: User;

  @Index()
  @Column("uuid", { nullable: true })
  @IsUUID()
  userId?: string;

  @ManyToOne(() => Client)
  client: Client;

  @Index()
  @Column("uuid")
  @IsUUID()
  clientId: string;

  @Column({ nullable: true })
  redirectUri?: string;

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

  constructor(data?: Partial<AuthCode>) {
    this.setClient(data?.client);
    this.setUser(data?.user);
    if (data?.scopes) this.scopes = data.scopes;
    this.token = data?.token ?? generateRandomToken();
    // @todo the new date interval is misleading here;
    this.expiresAt = data?.expiresAt ?? new DateInterval({ minutes: 10 }).end();
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

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}

export const addDays = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return date;
};
