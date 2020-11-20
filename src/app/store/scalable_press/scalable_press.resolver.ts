import { Args, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { ScalablePressService } from "~/app/store/scalable_press/scalable_press.service";
import { Address } from "~/app/store/scalable_press/dtos/address";

@Resolver()
export class ScalablePressResolver {
  constructor(private pressService: ScalablePressService) {}

  @Mutation(() => UploadDesignResponse!)
  uploadDesign(@Args("name") name: string, @Args("artworkURL") artworkURL: string) {
    return this.pressService.uploadDesign({ name, artworkURL }).toPromise();
  }

  @Mutation(() => QuoteOrderResponse!)
  quoteOrder(@Args("designId") designId: string, @Args("address") address: Address) {
    return this.pressService.quoteOrder({ designId, address }).toPromise();
  }

  @Mutation(() => OrderResponse!)
  submitOrder(@Args("orderToken") orderToken: string) {
    return this.pressService.submitOrder(orderToken).toPromise();
  }

  @Query(() => [TrackStatusResponse]!)
  trackOrder(@Args("orderId") orderId: string): Promise<TrackStatusResponse[]> {
    return this.pressService.trackOrder(orderId).toPromise();
  }

  // @Query(() => String!)
  // findQuote(@Args("quoteId") quoteId: string) {
  //   return this.printService.findQuote({ quoteId }).toPromise();
  // }

  // @Query(() => TrackStatusResponse!)
  // findDesign(@Args("designId") designId: string) {
  //   return this.printService.findDesign({ designId }).toPromise();
  // }
}

@ObjectType()
export class TrackStatusResponse {
  @Field()
  number: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  orderId: string;

  @Field()
  createdAt: Date;

  @Field()
  eventId: string;
}

@ObjectType()
export class QuoteOrderResponse {
  @Field()
  orderToken: string;

  @Field()
  total: number;

  @Field()
  subtotal: number;

  @Field()
  fees: number;

  @Field()
  tax: number;

  @Field()
  shipping: number;
}

@ObjectType()
export class UploadDesignResponse {
  @Field()
  designId: string;
}

@ObjectType()
export class OrderResponse {
  @Field()
  orderId: string;
  @Field()
  orderedAt: Date;
  @Field()
  total: number;
  @Field()
  subtotal: number;
  @Field()
  fees: number;
  @Field()
  shipping: number;
  @Field()
  tax: number;
  @Field()
  orderToken: string;
  @Field()
  mode: string;
  @Field()
  status: string;
  @Field(() => [Item]!)
  items: Item[];
}

@ObjectType()
export class Item {
  @Field()
  designId: string;
  @Field()
  type: string;
  // previews: any[];
  // features: Features;
  // pricing: Pricing;
  @Field()
  status: string;
  // @Field(() => Address!)
  // address: Address;
  // products: Product[];
  @Field()
  designURL: string;
}
