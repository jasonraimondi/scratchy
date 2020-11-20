import { Injectable } from "@nestjs/common";
import { InjectStripe } from "nestjs-stripe";
import type Stripe from "stripe";
import { ENV } from "~/config/configuration";

@Injectable()
export class StripeService {
  constructor(@InjectStripe() private readonly stripe: Stripe) {}

  createCheckoutSession({ name, price, quantity = 1 }: { name: string; price: number; quantity?: number }) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name,
            },
            unit_amount: price,
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: ENV.url + "/success",
      cancel_url: ENV.url + "/cancel",
    });
  }
}
