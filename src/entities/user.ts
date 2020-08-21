import { Field, ID, ObjectType, Root } from "type-graphql";
import { compare, hash } from "bcryptjs";
import { v4 } from "uuid";
import { IsEmail, validateOrReject } from "class-validator";


export interface ICreateUser {
  email: string;
  uuid?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

@ObjectType()
export class User {
  static async create({ uuid, email, firstName, lastName, password }: ICreateUser): Promise<User> {
    const user = new User(email, uuid ?? v4());
    user.firstName = firstName;
    user.lastName = lastName;
    await user.setPassword(password);
    await validateOrReject(user);
    return user;
  }

  private constructor(email: string, id: string) {
    this.id = id;
    this.email = email.toLowerCase();
    this.isEmailConfirmed = false;
    this.createdAt = new Date();
  }

  @Field(() => ID)
  id: string;

  @IsEmail()
  @Field()
  email: string;

  password?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  isEmailConfirmed: boolean;

  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date;


  @Field(() => Date)
  createdAt: Date;


  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  get name(): string {
    const name = [];
    if (this.firstName) name.push(this.firstName);
    if (this.lastName) name.push(this.lastName);
    return name.join(" ");
  }

  @Field()
  isActive(@Root() user: User): boolean {
    return user.isEmailConfirmed && !!user.password;
  }

  async setPassword(password?: string): Promise<void> {
    this.password = undefined;
    if (password) this.password = await hash(password, 12);
  }

  async verify(password: string): Promise<void> {
    if (!this.password) throw new Error("user must create password");
    if (!this.isActive(this)) throw new Error("user is not active");
    if (!(await compare(password, this.password))) throw new Error("invalid password");
  }
}
