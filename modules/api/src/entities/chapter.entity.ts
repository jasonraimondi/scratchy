import { ObjectType } from "@nestjs/graphql";
import { BaseChapter, ChapterConstructor, PrismaChapter } from "@modules/prisma/models";
import { User } from "~/entities/user.entity";
import { Book } from "~/entities/book.entity";

export const toChapter = (chapter: PrismaChapter) => new Chapter(chapter);
export const toChapters = (chapters: PrismaChapter[]) => chapters.map(b => new Chapter(b));

@ObjectType()
export class Chapter extends BaseChapter {
  constructor(props: ChapterConstructor) {
    props.book = props.book ? new Book(props.book) : undefined;
    props.user = props.user ? new User(props.user) : undefined;
    super(props);
  }
}
