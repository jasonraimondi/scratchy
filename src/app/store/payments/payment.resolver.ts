import { Args, Field, Mutation, ObjectType, Resolver } from "@nestjs/graphql";

import { StripeService } from "~/app/store/payments/stripe.service";
import { LoggerService } from "~/app/logger/logger.service";
import { ProductRepo } from "~/app/store/payments/repositories/product.repository";

@ObjectType()
export class CheckoutSessionResponse {
  @Field()
  sessionId: string;
}

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly stripeService: StripeService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Mutation(() => CheckoutSessionResponse!)
  async createCheckoutSession(@Args("productId") productId: string) {
    const product = await this.productRepo.findById(productId);

    const session = await this.stripeService.createCheckoutSession({
      name: product.type,
      price: product.unitPrice,
      quantity: 1,
    });

    const result = new CheckoutSessionResponse();
    result.sessionId = session.id;

    return result;
  }
}
