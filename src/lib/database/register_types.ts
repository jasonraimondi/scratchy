import { registerEnumType } from "@nestjs/graphql";
import { Order } from "~/lib/database/dtos/paginator.inputs";

export const registerTypes = () => {
  registerEnumType(Order, {
    name: "Order",
  });
};
