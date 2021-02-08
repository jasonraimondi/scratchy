import { TestingModule } from '@nestjs/testing';
import { GithubController } from './github.controller';
import { createTestingModule } from "~test/app_testing.module";
import { AuthModule } from "~/app/auth/auth.module";

describe('GithubController', () => {
  let controller: GithubController;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      imports: [AuthModule],
    });

    controller = module.get<GithubController>(GithubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
