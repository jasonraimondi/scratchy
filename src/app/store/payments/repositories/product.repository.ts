import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BaseRepo } from "~/app/database/base.repository";
import { Product } from "~/app/store/payments/entities/product.entity";

@Injectable()
export class ProductRepo extends BaseRepo<Product> {
  constructor(@InjectRepository(Product) productRepository: Repository<Product>) {
    super(productRepository);
  }
}
