import { registerEnumType } from "@nestjs/graphql";
import { PaginationOrder } from "~/lib/repositories/dtos/paginator.inputs";

export const registerTypes = () => {
  registerEnumType(PaginationOrder, {
    name: "Order",
  });
};
