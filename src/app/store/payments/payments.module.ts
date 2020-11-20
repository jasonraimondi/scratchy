import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StripeModule } from "nestjs-stripe";

import { ENV } from "~/config/configuration";
import { PaymentResolver } from "~/app/store/payments/payment.resolver";
import { StripeService } from "~/app/store/payments/stripe.service";
import { LoggerModule } from "~/app/logger/logger.module";
import { DatabaseModule } from "~/app/database/database.module";
import { Payment } from "~/app/store/payments/entities/payment.entity";
import { ProductRepo } from "~/app/store/payments/repositories/product.repository";
import { PaymentRepo } from "~/app/store/payments/repositories/payment.repository";
import { Product } from "~/app/store/payments/entities/product.entity";

@Module({
  imports: [
    LoggerModule,
    StripeModule.forRoot({
      apiKey: ENV.stripeApiKey,
      apiVersion: "2020-08-27",
      typescript: true,
    }),
    TypeOrmModule.forFeature([Payment, Product]),
    DatabaseModule,
  ],
  providers: [PaymentResolver, StripeService, ProductRepo, PaymentRepo],
})
export class PaymentsModule {}
