import { PrismaService } from "~/lib/database/prisma.service";

export class ChapterRepository {
  protected readonly repo = this.prisma.chapter;

  constructor(private readonly prisma: PrismaService) {}

}
