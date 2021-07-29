import { Module } from "@nestjs/common";
import { OtpService } from "~/lib/otp/otp.service";
import { Provider } from "@nestjs/common/interfaces/modules/provider.interface";
import { ENV } from "~/config/environments";

const otpService: Provider = {
  provide: OtpService,
  useFactory: () => new OtpService(ENV.secrets.otp),
};

@Module({
  imports: [],
  providers: [otpService],
  exports: [otpService],
})
export class OtpModule {}
