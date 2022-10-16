import { sleep } from "$lib/utils/sleep";

export function backoffCallback(toTry: () => Promise<void>, maxAttempts: number, delay = 200) {
  return new Promise(async (resolve, reject) => {
    try {
      --maxAttempts;
      const data = await toTry();
      resolve(data);
    } catch (error: any) {
      if (maxAttempts > 0) {
        await sleep(delay);
        await backoffCallback(toTry, maxAttempts, delay * 2);
      } else {
        reject(error.message);
      }
    }
  });
}
