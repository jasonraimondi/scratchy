import { OtpService } from "~/lib/otp/otp.service";
import { Test } from "@nestjs/testing";

describe("OtpService", () => {
  let service: OtpService;
  const secret = "thisismysupersecretsecretsecret";

  beforeEach(async () => {
    const container = await Test.createTestingModule({
      providers: [
        {
          provide: OtpService,
          useFactory: () => new OtpService(secret),
        },
      ],
    }).compile();
    service = container.get<OtpService>(OtpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    console.log(service.generate());
    console.log(service.verify(service.generate()));
  });
});
