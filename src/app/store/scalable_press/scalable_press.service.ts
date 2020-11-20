import { HttpService, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AxiosError } from "axios";
import { catchError, map, tap } from "rxjs/operators";
import MultipartFormData from "form-data";

import { Address } from "~/app/store/scalable_press/dtos/address";
import {
  OrderResponse,
  QuoteOrderResponse,
  TrackStatusResponse,
  UploadDesignResponse,
} from "~/app/store/scalable_press/scalable_press.resolver";
import { IEvent, IOrder, IQuote } from "~/app/store/scalable_press/scalable_press";
import { LoggerService } from "~/app/logger/logger.service";

@Injectable()
export class ScalablePressService {
  constructor(private httpService: HttpService, private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  async fooby({ artworkURL, address, name }: any) {
    address = { name: "Home", address1: "204 W Windsor Road", city: "Glendale", state: "California", zip: "91204" };
    const designResponse = await this.uploadDesign({ name, artworkURL }).toPromise();
    const quotedOrderResponse = await this.quoteOrder({
      designId: designResponse.designId,
      address,
    }).toPromise();
    const foo = await this.submitOrder(quotedOrderResponse.orderToken).toPromise();
    this.logger.log(foo);
    return foo;
  }

  // findDesign({ designId }: { designId: string }): Observable<AxiosResponse<any[]>> {
  //   return this.httpService.get("/design/" + designId).pipe(
  //     map((response) => response.data),
  //     catchError(this.handleError),
  //     tap(console.log),
  //   );
  // }
  //
  // findQuote({ quoteId }: { quoteId: string }): Observable<AxiosResponse<any[]>> {
  //   return this.httpService.get("/quote/" + quoteId).pipe(
  //     map((response) => response.data),
  //     catchError(this.handleError),
  //     tap(console.log),
  //   );
  // }

  uploadDesign({ name, artworkURL }: { name: string; artworkURL: string }): Observable<UploadDesignResponse> {
    const form = new MultipartFormData();
    form.append("type", "poster");
    form.append("name", name);
    form.append("sides[front][artwork]", artworkURL);
    form.append("sides[front][dimensions][width]", "17");

    return this.httpService.post("/design", form, { headers: form.getHeaders() }).pipe(
      map((response) => response.data),
      catchError(this.handleError),
    );
  }

  quoteOrder({ designId, address }: { designId: string; address: Address }): Observable<QuoteOrderResponse> {
    const form = new MultipartFormData();
    form.append("designId", designId);
    form.append("type", "poster");
    form.append("products[0][id]", "gloss-poster");
    form.append("products[0][color]", "white");
    form.append("products[0][size]", "one");
    form.append("products[0][quantity]", "1");
    if (address.name) form.append("address[name]", address.name);
    form.append("address[address1]", address.address1);
    if (address.address2) form.append("address[address2]", address.address2);
    form.append("address[city]", address.city);
    form.append("address[state]", address.state);
    form.append("address[zip]", address.zip);

    return this.httpService
      .post<IQuote>("/quote", form, { headers: form.getHeaders() })
      .pipe(
        map(
          (response): QuoteOrderResponse => {
            const result = new QuoteOrderResponse();
            result.orderToken = response.data.orderToken;
            result.total = response.data.total;
            result.subtotal = response.data.subtotal;
            result.fees = response.data.fees;
            result.tax = response.data.tax;
            result.shipping = response.data.shipping;
            return result;
          },
        ),
        tap(console.log),
        catchError(this.handleError),
      );
  }

  submitOrder(orderToken: string): Observable<OrderResponse> {
    return this.httpService
      .post<IOrder>("/order", { orderToken })
      .pipe(
        map(
          (response): OrderResponse => {
            const result = new OrderResponse();
            result.orderId = response.data.orderId;
            result.tax = response.data.tax;
            result.status = response.data.status;
            return result;
          },
        ),
        tap(console.log),
        catchError(this.handleError),
      );
  }

  trackOrder(orderId: string): Observable<TrackStatusResponse[]> {
    return this.httpService
      .get<IEvent[]>("https://api.scalablepress.com/v3/event", {
        params: {
          orderId,
        },
      })
      .pipe(
        map((response) => {
          const events: TrackStatusResponse[] = [];
          response.data.forEach((event) => {
            const track = new TrackStatusResponse();
            track.name = event.name;
            track.description = event.description;
            track.number = event.number;
            track.orderId = event.orderId;
            track.eventId = event.eventId;
            track.createdAt = event.createdAt;
            events.push(track);
          });
          return events;
        }),
        tap(console.log),
        catchError(this.handleError),
      );
  }

  private handleError(err: AxiosError): Observable<any> {
    const result = err.response?.data ?? err.toJSON?.() ?? err.message ?? "Something Went Wrong";
    throw new Error(JSON.stringify(result));
  }
}
