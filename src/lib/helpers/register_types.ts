import { registerEnumType } from "@nestjs/graphql";
import { Order } from "~/lib/repositories/dtos/paginator.inputs";

export const registerTypes = () => {
  registerEnumType(Order, {
    name: "Order",
  });
};
