import { DateInterval } from "@jmondi/date-interval";
import { OAuthRefreshToken } from "@jmondi/oauth2-server";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { generateRandomToken } from "~/app/oauth/entities/random_token";

@Entity("oauth_refresh_tokens")
export class RefreshToken implements OAuthRefreshToken {
  @PrimaryColumn("varchar", { length: 128 })
  readonly refreshToken: string;

  @Column({ nullable: false })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => AccessToken, { nullable: true })
  @JoinColumn({ name: "accessTokenToken" })
  accessToken?: AccessToken;

  @Column("varchar", { length: 128, nullable: true })
  accessTokenToken?: string;

  constructor(data?: Partial<RefreshToken>) {
    this.refreshToken = data?.refreshToken ?? generateRandomToken();
    // @todo dont set the date interval here maybe
    this.expiresAt = data?.expiresAt ?? new DateInterval({ hours: 1 }).end();
  }
}
