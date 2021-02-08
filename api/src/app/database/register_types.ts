import { registerEnumType } from "@nestjs/graphql";
import { Order } from "~/app/database/dtos/paginator.inputs";

export const registerTypes = () => {
  registerEnumType(Order, {
    name: "Order",
  });
};
