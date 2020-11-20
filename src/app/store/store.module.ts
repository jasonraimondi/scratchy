import { Module } from "@nestjs/common";
import { ScalablePressModule } from "~/app/store/scalable_press/scalable_press.module";
import { PaymentsModule } from "~/app/store/payments/payments.module";
import { StorageModule } from "~/app/store/storage/storage.module";

@Module({
  imports: [StorageModule, ScalablePressModule, PaymentsModule],
})
export class StoreModule {}
