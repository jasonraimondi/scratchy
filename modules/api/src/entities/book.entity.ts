import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "~/entities/user.entity";
import { BaseBook, BookConstructor, PrismaBook } from "@modules/prisma/models";
import { Chapter } from "~/entities/chapter.entity";

export const toBook = (book: PrismaBook) => new Book(book);
export const toBooks = (books: PrismaBook[]) => books.map(b => new Book(b));

@ObjectType()
export class Book extends BaseBook {
  @Field(() => User, { nullable: true })
  user!: null | User;

  @Field(() => [Chapter], { nullable: true })
  chapters!: null | Chapter[];

  constructor(props: BookConstructor) {
    props.chapters = props.chapters?.map(c => new Chapter(c)) ?? [];
    props.user = props.user ? new User(props.user) : undefined;
    super(props);
  }
}
