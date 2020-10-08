import { OAuthScope } from "@jmondi/oauth2-server";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("oauth_scopes")
export class Scope implements OAuthScope {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  constructor(data?: Partial<Scope>) {
    if (data?.name) this.name = data.name;
    if (data?.description) this.description = data.description;
  }
}
