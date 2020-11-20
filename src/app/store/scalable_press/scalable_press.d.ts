export interface IQuote {
  total: number;
  subtotal: number;
  fees: number;
  tax: number;
  shipping: number;
  breakdown: Breakdown[];
  sla: Sla[];
  dimensions: Dimension[];
  facilities: string[];
  orderToken: string;
  warnings: any[];
  mode: string;
}

export interface Breakdown {
  fees: number;
  shipping: number;
  printing: number;
  blanks: number;
  tax: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Dimension {}

export interface Sla {
  days: number;
}

export interface IOrder {
  orderedAt: Date;
  total: number;
  subtotal: number;
  fees: number;
  shipping: number;
  tax: number;
  orderToken: string;
  mode: string;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  warnings: any[];
  events: Event[];
  items: Item[];
  orderId: string;
  reprint: Reprint;
}

export interface Event {
  name: string;
  description: string;
  createdAt: Date;
}

export interface Item {
  designId: string;
  type: string;
  previews: any[];
  features: Features;
  pricing: Pricing;
  status: string;
  address: Address;
  products: Product[];
  designURL: string;
}

export interface Address {
  name: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Features {
  customizations: any[];
}

export interface Pricing {
  fees: number;
  shipping: number;
  printing: number;
  blanks: number;
  tax: number;
}

export interface Product {
  id: string;
  color: string;
  size: string;
  quantity: number;
  blankPrice: number;
}

export interface Reprint {
  itemIndexes: any[];
}

export interface IEvent {
  number: number;
  name: string;
  description: string;
  orderId: string;
  createdAt: Date;
  eventId: string;
}
