import { ResolveTime } from "~/lib/middleware/resolve_time";

describe("resolve_time", () => {
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  test("displays resolver run times", async () => {
    // arrange
    const action: any = {
      info: {
        is_testing: true,
        parentType: {
          name: "Name",
        },
        fieldName: "FieldName",
      },
    };
    const timeout = 5;
    const next = async () => await sleep(timeout);

    // act
    const { resolveTime, message } = await ResolveTime(action, next);

    // assert
    expect(resolveTime).toBeGreaterThanOrEqual(timeout);
    expect(message).toMatch(/Name\.FieldName \[\d+ ms]/);
  });
});
