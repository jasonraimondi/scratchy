import { arrayDiff } from "~/lib/utils/array";

test(arrayDiff.name, () => {
  expect(arrayDiff([1, 2, 3], [1, 3])).toStrictEqual([2]);
  expect(arrayDiff([1, 2, 3, 4], [1, 3])).toStrictEqual([2, 4]);
  expect(arrayDiff([1, 2, 3, 4], [1, 3, 5])).toStrictEqual([2, 4]);
});
