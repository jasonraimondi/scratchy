import { OAuthUser } from "@jmondi/oauth2-server";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { compare, hash } from "bcryptjs";
import { IsEmail, IsIP } from "class-validator";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { v4 } from "uuid";

import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";
import { UnauthorizedException } from "~/entity/user/exceptions/unauthorized.exception";

export interface ICreateUser {
  email: string;
  createdIP?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

const inet = process.env.NODE_ENV === "test" ? "text" : "inet";

@ObjectType()
@Entity("users")
export class User implements OAuthUser {
  static async create({ id, email, firstName, lastName, password, createdIP = "0.0.0.0" }: ICreateUser) {
    const user = new User(id);
    user.email = email.toLowerCase();
    user.firstName = firstName;
    user.lastName = lastName;
    user.createdIP = createdIP;
    if (password) await user.setPassword(password);
    return user;
  }

  get identifier() {
    return this.id;
  }

  constructor(id = v4()) {
    this.id = id;
    this.tokenVersion = 0;
    this.isEmailConfirmed = false;
  }

  @Field(() => ID)
  @PrimaryColumn("uuid")
  id: string;

  @Field()
  @Index({ unique: true })
  @Column({ length: 255 })
  @IsEmail()
  email: string;

  @Column({ length: 255, nullable: true })
  password?: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  lastName?: string;

  @Field()
  @Column("boolean")
  isEmailConfirmed: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column(inet, { nullable: true })
  @IsIP()
  lastLoginIP?: string;

  @Column(inet, { nullable: true })
  @IsIP()
  createdIP?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @Column("int")
  tokenVersion: number;

  @Column({ nullable: true })
  oauthGoogleIdentifier?: string;

  @Column({ nullable: true })
  oauthGithubIdentifier?: string;

  @Field(() => [Role], { nullable: "itemsAndList", defaultValue: [] })
  @ManyToMany(() => Role, { onDelete: "CASCADE" })
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "roleId", referencedColumnName: "id" },
  })
  roles: Role[];

  @ManyToMany(() => Permission, { onDelete: "CASCADE" })
  @JoinTable({ name: "user_permissions" })
  permissions: Permission[];

  @Field(() => Boolean)
  get isActive(): boolean {
    return this.isEmailConfirmed;
  }

  @Field(() => String, { nullable: true })
  get name() {
    const name = [];
    if (this.firstName) name.push(this.firstName);
    if (this.lastName) name.push(this.lastName);
    return name.join(" ") || null;
  }

  async setPassword(password: string) {
    this.password = await hash(password, 12);
  }

  async verify(password: string) {
    if (!this.password && this.oauthGoogleIdentifier)
      throw UnauthorizedException.invalidUser("user must login with google or reset password");
    if (!this.password) throw UnauthorizedException.invalidUser("user must create password");
    if (!this.isActive) throw UnauthorizedException.invalidUser("user is not active");
    if (!(await compare(password, this.password))) {
      throw UnauthorizedException.invalidUser("invalid password");
    }
  }

  get jwtPayload() {
    return {
      id: this.id,
      email: this.email,
      isActive: this.isActive,
    };
  }
}
