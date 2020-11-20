import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Payment } from "~/app/store/payments/entities/payment.entity";
import { BaseRepo } from "~/app/database/base.repository";

@Injectable()
export class PaymentRepo extends BaseRepo<Payment> {
  constructor(@InjectRepository(Payment) paymentRepository: Repository<Payment>) {
    super(paymentRepository);
  }
}
