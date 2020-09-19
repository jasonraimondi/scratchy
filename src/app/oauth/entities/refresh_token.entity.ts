import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

@Entity("oauth_refresh_tokens")
export class RefreshToken {
  @PrimaryColumn("uuid")
  readonly token: string;

  @Column({ nullable: false })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  constructor(token?: string) {
    this.token = token ?? v4();
  }
}
