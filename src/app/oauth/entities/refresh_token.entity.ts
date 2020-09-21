import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

import { generateRandomToken } from "~/app/oauth/entities/random_token";

@Entity("oauth_refresh_tokens")
export class RefreshToken {
  @PrimaryColumn("varchar", { length: 128 })
  readonly token: string;

  @Column({ nullable: false })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  constructor(data?: Partial<RefreshToken>) {
    this.token = data?.token ?? generateRandomToken();
  }
}
