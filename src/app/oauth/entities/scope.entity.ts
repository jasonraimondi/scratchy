import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("oauth_scopes")
export class Scope {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
